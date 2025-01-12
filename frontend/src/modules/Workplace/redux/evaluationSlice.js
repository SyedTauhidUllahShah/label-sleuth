/*
    Copyright (c) 2022 IBM Corp.
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCategoryQueryString,
  getQueryParamsString,
  parseElements,
} from "../../../utils/utils";
import { BASE_URL, WORKSPACE_API } from "../../../config";
import { panelIds } from "../../../const";
import { client } from "../../../api/client";
import { getWorkspaceId } from "../../../utils/utils";

const getWorkspace_url = `${BASE_URL}/${WORKSPACE_API}`;

export const startEvaluation = createAsyncThunk(
  "workspace/startEvaluation",
  async (request, { dispatch }) => {
    await dispatch(getEvaluationElements());
  }
);

export const getEvaluationElements = createAsyncThunk(
  "workspace/getEvaluationElements",
  async (request, { getState }) => {
    const state = getState();

    const queryParams = getQueryParamsString([
      getCategoryQueryString(state.workspace.curCategory),
    ]);

    var url = `${getWorkspace_url}/${encodeURIComponent(
      getWorkspaceId()
    )}/precision_evaluation_elements${queryParams}`;

    const response = await client.get(url);
    return response.data;
  }
);

export const getEvaluationResults = createAsyncThunk(
  "workspace/getEvaluationResults",
  async (changed_elements_count, { getState }) => {
    const state = getState();

    const ids = Object.values(
      state.workspace.panels[panelIds.EVALUATION].elements
    ).map((e) => e.id);
    const iteration = state.workspace.modelVersion - 1;
    const queryParams = getQueryParamsString([
      getCategoryQueryString(state.workspace.curCategory),
    ]);

    var url = `${getWorkspace_url}/${encodeURIComponent(
      getWorkspaceId()
    )}/precision_evaluation_elements${queryParams}`;

    const response = await client.post(url, {
      ids,
      iteration,
      changed_elements_count,
    });

    return response.data;
  }
);

export const cancelEvaluation = createAsyncThunk(
  "workspace/cancelEvaluation",
  async (changed_elements_count, { getState }) => {
    const state = getState();

    const queryParams = getQueryParamsString([
      getCategoryQueryString(state.workspace.curCategory),
    ]);

    var url = `${getWorkspace_url}/${encodeURIComponent(
      getWorkspaceId()
    )}/cancel_precision_evaluation${queryParams}`;


    const response = await client.post(url, {
      changed_elements_count,
    });
    return response.data;
  }
);

export const reducers = {
  cleanEvaluationState(state, action) {
    state.panels[panelIds.EVALUATION] = {
      ...state.panels[panelIds.EVALUATION],
      isInProgress: false,
      elements: null,
      initialElements: null,
      lastScore: null,
      scoreModelVersion: null,
    };
  },
};

export const extraReducers = {
  [startEvaluation.fulfilled]: (state, action) => {
    state.panels[panelIds.EVALUATION].isInProgress = true;
  },
  [getEvaluationElements.fulfilled]: (state, action) => {
    const { elements: unparsedElements } = action.payload;
    const { elements: initialElements } = parseElements(
      unparsedElements,
      state.curCategory
    );
    state.panels.loading[panelIds.EVALUATION] = false;
    state.panels[panelIds.EVALUATION] = {
      ...state.panels[panelIds.EVALUATION],
      initialElements,
      elements: initialElements,
      hitCount: Object.keys(initialElements).length
    };
  },
  [getEvaluationElements.pending]: (state, action) => {
    state.panels.loading[panelIds.EVALUATION] = true;
  },
  [getEvaluationElements.rejected]: (state, action) => {
    state.panels.loading[panelIds.EVALUATION] = false;
  },
  [getEvaluationResults.fulfilled]: (state, action) => {
    const { score } = action.payload;
    state.panels.loading[panelIds.EVALUATION] = false;
    state.panels[panelIds.EVALUATION] = {
      ...state.panels[panelIds.EVALUATION],
      isInProgress: false,
      lastScore: score,
      scoreModelVersion: state.modelVersion,
    };
  },
  [getEvaluationResults.pending]: (state, action) => {
    state.panels.loading[panelIds.EVALUATION] = true;
  },
  [getEvaluationResults.rejected]: (state, action) => {
    state.panels.loading[panelIds.EVALUATION] = false;
  },
  [cancelEvaluation.pending]: (state, action) => {
    state.panels.loading[panelIds.EVALUATION] = true;
  },
  [cancelEvaluation.fulfilled]: (state, action) => {
    state.panels.loading[panelIds.EVALUATION] = false;
    state.panels[panelIds.EVALUATION] = {
      ...state.panels[panelIds.EVALUATION],
      initialElements: {},
      isInProgress: false,
      elements: {},
      hitCount: null,
    };
  },
};
