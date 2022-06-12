import io
import os
import time
import tempfile
import unittest

from label_sleuth import app, config
from label_sleuth.orchestrator.core.state_api.orchestrator_state_api import IterationStatus

HEADERS = {'Content-Type': 'application/json'}


class TestAppIntegration(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.temp_dir = tempfile.TemporaryDirectory()
        path_to_test_config = os.path.abspath(os.path.join(__file__, os.pardir, "config_for_tests.json"))
        app_for_test = app.create_app(config=config.load_config(path_to_test_config),
                                      output_dir=os.path.join(cls.temp_dir.name, 'output'))
        app_for_test.test_request_context("/")
        app_for_test.config['TESTING'] = True
        app_for_test.config['LOGIN_DISABLED'] = True

        print(f"Integration tests, all output files will be written under {cls.temp_dir}")
        cls.client = app_for_test.test_client()

    @classmethod
    def tearDownClass(cls):
        cls.temp_dir.cleanup()

    def test_full_flow(self):
        dataset_name = "my_test_dataset"
        workspace_name = "my_test_workspace"
        category_name = "my_category"
        category_description = "my_category_description"
        data = {}
        data['file'] = (io.BytesIO(b'document_id,text\n'
                                   b'document1,this is the first text element of document one\n'
                                   b'document2,this is the second text element of document one\n'
                                   b'document2,this is the only text element in document two\n'
                                   b'document3,"document 3 has three text elements, this is the first"\n'
                                   b'document3,"document 3 has three text elements, this is the second"\n'
                                   b'document3,"document 3 has three text elements, this is the third"\n'),
                        'my_file.csv')
        res = self.client.post(f"/datasets/{dataset_name}/add_documents", data=data, headers=HEADERS,
                               content_type='multipart/form-data')

        self.assertEqual(200, res.status_code, msg="Failed to upload a new dataset")
        self.assertEqual(
            {'dataset_name': 'my_test_dataset', 'num_docs': 3, 'num_sentences': 6, 'workspaces_to_update': []},
            res.get_json(), msg="diff in upload dataset response")
        res = self.client.post("/workspace",
                               data='{{"workspace_id":"{}","dataset_id":"{}"}}'.format(workspace_name, dataset_name),
                               headers=HEADERS)
        self.assertEqual(200, res.status_code, msg="Failed to create a workspace")
        self.assertEqual(
            {"workspace": {'dataset_name': 'my_test_dataset', 'first_document_id': 'my_test_dataset-document1',
                           'workspace_id': 'my_test_workspace'}}, res.get_json(),
            msg="diff in create workspace response")
        res = self.client.post(f"/workspace/{workspace_name}/category",
                               data='{{"category_name":"{}","category_description":"{}"}}'.format(category_name,
                                                                                                  category_description),
                               headers=HEADERS)
        self.assertEqual(200, res.status_code, msg="Failed to add a new category to workspace")
        self.assertEqual({'category': {'category_description': 'my_category_description',
                                       'category_name': 'my_category', 'id': 'my_category'}}, res.get_json(),
                         msg="diff in create category response")

        res = self.client.get(f"/workspace/{workspace_name}/documents", headers=HEADERS)
        self.assertEqual(200, res.status_code, msg="Failed to get all documents uris")
        documents = res.get_json()['documents']
        self.assertEqual(3, len(documents),
                         msg="Number of retrieved documents is different the number of documents loaded")
        self.assertEqual({'documents': [{'document_id': 'my_test_dataset-document1'},
                                        {'document_id': 'my_test_dataset-document2'},
                                        {'document_id': 'my_test_dataset-document3'}]}, res.get_json(),
                         msg="diff in get documents")
        res = self.client.get(f"/workspace/{workspace_name}/document/{documents[-1]['document_id']}", headers=HEADERS)
        self.assertEqual(200, res.status_code, msg="Failed to add a document before labeling")
        document3_elements = res.get_json()['elements']
        self.assertEqual([
            {'begin': 0, 'docid': 'my_test_dataset-document3', 'end': 53, 'id': 'my_test_dataset-document3-0',
             'model_predictions': {}, 'text': 'document 3 has three text elements, this is the first',
             'user_labels': {}},
            {'begin': 54, 'docid': 'my_test_dataset-document3', 'end': 108, 'id': 'my_test_dataset-document3-1',
             'model_predictions': {}, 'text': 'document 3 has three text elements, this is the second',
             'user_labels': {}},
            {'begin': 109, 'docid': 'my_test_dataset-document3', 'end': 162, 'id': 'my_test_dataset-document3-2',
             'model_predictions': {}, 'text': 'document 3 has three text elements, this is the third',
             'user_labels': {}}], document3_elements, msg=f"diff in {documents[-1]['document_id']} content")

        res = self.client.put(f'/workspace/{workspace_name}/element/{document3_elements[0]["id"]}',
                              data='{{"category_name":"{}","value":"{}"}}'.format(category_name, True), headers=HEADERS)
        self.assertEqual(200, res.status_code, msg="Failed to set the first label for a category")
        self.assertEqual({'category_name': 'my_category',
                          'element': {'begin': 0, 'docid': 'my_test_dataset-document3', 'end': 53,
                                      'id': 'my_test_dataset-document3-0', 'model_predictions': {},
                                      'text': 'document 3 has three text elements, this is the first',
                                      'user_labels': {'my_category': 'true'}}, 'workspace_id': 'my_test_workspace'},
                         res.get_json(), msg="diff in setting element's label response")
        res = self.client.get(f"/workspace/{workspace_name}/status?category_name={category_name}",
                              headers=HEADERS)
        self.assertEqual(200, res.status_code, msg="Failed to get status after successfully setting the first label")
        self.assertEqual({'labeling_counts': {'true': 1}, 'notifications': [], 'progress': {'all': 50}},
                         res.get_json(), msg="diffs in get status response after setting a label")

        res = self.client.put(f'/workspace/{workspace_name}/element/{document3_elements[1]["id"]}',
                              data='{{"category_name":"{}","value":"{}"}}'.format(category_name, False), headers=HEADERS)
        self.assertEqual(200, res.status_code, msg="Failed to set the second label for a category")
        self.assertEqual({'category_name': 'my_category',
                          'element': {'begin': 54, 'docid': 'my_test_dataset-document3', 'end': 108,
                                      'id': 'my_test_dataset-document3-1', 'model_predictions': {},
                                      'text': 'document 3 has three text elements, this is the second',
                                      'user_labels': {'my_category': 'false'}}, 'workspace_id': 'my_test_workspace'},
                         res.get_json(), msg="diff in setting element's label response")
        res = self.client.get(f"/workspace/{workspace_name}/status?category_name={category_name}",
                              headers=HEADERS)
        self.assertEqual(200, res.status_code, msg="Failed to get status after successfully setting the first label")
        self.assertEqual({'labeling_counts': {'true': 1, 'false': 1}, 'notifications': [], 'progress': {'all': 50}},
                         res.get_json(), msg="diffs in get status response after setting a label")

        res = self.client.put(f'/workspace/{workspace_name}/element/{document3_elements[2]["id"]}',
                              data='{{"category_name":"{}","value":"{}"}}'.format(category_name, True), headers=HEADERS)

        self.assertEqual(200, res.status_code, msg="Failed to set the third label for category")
        self.assertEqual({'category_name': 'my_category',
                          'element': {'begin': 109, 'docid': 'my_test_dataset-document3', 'end': 162,
                                      'id': 'my_test_dataset-document3-2', 'model_predictions': {},
                                      'text': 'document 3 has three text elements, this is the third',
                                      'user_labels': {'my_category': 'true'}}, 'workspace_id': 'my_test_workspace'},
                         res.get_json())

        res = self.client.get(f"/workspace/{workspace_name}/status?category_name={category_name}",
                              headers=HEADERS)
        self.assertEqual(200, res.status_code, msg="Failed to get status after successfully setting the third label")
        self.assertEqual({'true': 2,'false': 1},
                         res.get_json()['labeling_counts'], msg="diffs in get status response after setting the second label")

        waiting_count = 0
        MAX_WAITING_FOR_TRAINING = 50 # wait maximum 5 seconds for the training (should be much faster)
        while waiting_count < MAX_WAITING_FOR_TRAINING:
            # since get_status is asynchronously starting a new training, we need to wait until it added to the
            # iterations list and finishes successfully
            res = self.client.get(f"/workspace/{workspace_name}/models?category_name={category_name}",
                                  headers=HEADERS)
            if res.status_code!= 200 or (len(res.get_json()["models"])==1
                                         and res.get_json()['models'][0]['active_learning_status']==IterationStatus.READY.name):
                break
            time.sleep(0.1)
            waiting_count += 1

        self.assertEqual(200, res.status_code, msg="Failed to get models list")



        print("Done")