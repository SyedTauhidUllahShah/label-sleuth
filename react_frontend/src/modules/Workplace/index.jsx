import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import './styles.css'
import Divider from '@mui/material/Divider';
import LinearWithValueLabel from './ModelProgressBar'
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import Highlighter from "react-highlight-words";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import CreateCategoryModal from './Modal';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SearchPanel from './SearchPanel'
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useDispatch, useSelector } from 'react-redux';
import { fetchElements, getElementToLabel, prevPrediction, nextPrediction, fetchCategories, getPositiveElementForCategory, checkModelUpdate, updateCurCategory, fetchDocuments, fetchPrevDocElements, fetchNextDocElements, setFocusedState, searchKeywords, fetchCertainDocument } from './DataSlice.jsx';
import InputBase from '@mui/material/InputBase';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import CircularProgress from '@mui/material/CircularProgress';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import SearchBar from "material-ui-search-bar";
import Element from "./Element"
import CardContent from '@mui/material/CardContent';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ListItemButton from '@mui/material/ListItemButton';
import Accordion from '@mui/material/Accordion';
import ListItemIcon from '@mui/material/ListItemIcon';
import { makeStyles } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';
import { PieChart } from 'react-minimal-pie-chart';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ListItemText from '@mui/material/ListItemText';
import HSBar from "react-horizontal-stacked-bar-chart";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { FamilyRestroomRounded } from '@mui/icons-material';

const drawerWidth = 260;

const rightDrawerWidth = 400;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const WorkspaceHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  // width: `calc(100% - ${drawerWidth}px)`,
  // necessary for content to be below app bar
}));

const ClassContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: "8px",
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
  marginBottom: 2
  // necessary for content to be below app bar
  // ...theme.mixins.toolbar,
}));

const AccountInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  // necessary for content to be below app bar
  // ...theme.mixins.toolbar,
}));

const ToolBar = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1, 2),
  // necessary for content to be below app bar
  // ...theme.mixins.toolbar,
}));

const TitleBar = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  marginBottom: 10
  // necessary for content to be below app bar
  // ...theme.mixins.toolbar,
}));

const ModelName = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: "row",
  alignItems: 'start',
  justifyContent: 'space-between',
  margin: theme.spacing(2, 0),
  padding: theme.spacing(0, 2),
  // necessary for content to be below app bar
  // ...theme.mixins.toolbar,
}));

const WorkspaceSelect = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  // alignItems: 'center',
  // justifyContent: 'space-between',
  margin: theme.spacing(2, 0),
  padding: theme.spacing(0, 2),
  // necessary for content to be below app bar
  // ...theme.mixins.toolbar,
}));

const StackBarContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 80,
  margin: theme.spacing(0, 0),
  padding: theme.spacing(0, 2),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: 0,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: rightDrawerWidth,
    }),
  }),
);

const AppBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${rightDrawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: rightDrawerWidth,
  }),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));


const useStyles = makeStyles((theme) => ({
  line: {
    borderBlockColor: "red"
  }
}));

// const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
//   ({ theme, open }) => ({
//     width: drawerWidth,
//     flexShrink: 0,
//     whiteSpace: 'nowrap',
//     boxSizing: 'border-box',
//     ...(open && {
//       ...openedMixin(theme),
//       '& .MuiDrawer-paper': openedMixin(theme),
//     }),
//     ...(!open && {
//       ...closedMixin(theme),
//       '& .MuiDrawer-paper': closedMixin(theme),
//     }),
//   }),
// );

const Line = styled(Box)((props) => ({
  ...(props.focused && {
    borderRadius: 16,
    border: "thin solid",
    borderColor: "#f48c06"
  }),
  outline: "None",
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: 5,
  paddingTop: 3,
  marginBottom: 15
}))

const HistoryText = styled(Box)((props) => ({
  borderRadius: 16,
  border: "thin solid black",
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 3,
  padding: 2.5
}))

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

function WorkspaceSelectFormControl() {
  return (
    <FormControl sx={{ marginTop: 1, minWidth: 120 }}>
      <Select
        id="workspace-select"
        sx={{ height: "70%" }}
      // value={age}
      // onChange={handleChange}
      >
        <MenuItem value={10}>fairytale-bias-val-split</MenuItem>
        <MenuItem value={20}>wiki_animals</MenuItem>
        <MenuItem value={30}>storybook-bias</MenuItem>
      </Select>
      {/* <FormHelperText>With label + helper text</FormHelperText> */}
    </FormControl>
  );
}

function ModelFormControl() {
  return (
    <FormControl sx={{ marginTop: 1, minWidth: 60, paddingLeft: 2, paddingRight: 2 }}>
      <Select
        id="model-select"
        sx={{ height: "70%" }}
      // value={age}
      // onChange={handleChange}
      >
        <MenuItem value={10}>Model 1</MenuItem>
        <MenuItem value={20}>Model 2</MenuItem>
        <MenuItem value={30}>Model 3</MenuItem>
      </Select>
      {/* <FormHelperText>With label + helper text</FormHelperText> */}
    </FormControl>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function CategoryFormControl(props) {

  const workspace = useSelector(state => state.workspace)
  const dispatch = useDispatch()

  return (
    <FormControl sx={{ marginTop: 1, minWidth: 150, padding: 2 }}>
      <Select
        id="label-select"
        sx={{ height: 30 }}
        value={workspace.curCategory}
        onChange={(e) => {
          dispatch(updateCurCategory(e.target.value))
          dispatch(fetchElements()).then(() => 
          dispatch(getPositiveElementForCategory()).then(() => {
            dispatch(getElementToLabel())
          }))
        }}>
        {
          workspace.new_categories.map((category) => {
            return (<MenuItem value={category}>{category}</MenuItem>)
          })
        }
        {
          workspace.categories.map((e) => {
            return (<MenuItem value={e.id}>{e.category_name}</MenuItem>)
          })
        }
      </Select>
      {/* <FormHelperText>With label + helper text</FormHelperText> */}
    </FormControl>
  );
}


export default function Workspace() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const init_focused_states = {
    L0: false,
    L1: false,
    L2: false,
    L3: false,
    L4: false,
    L5: false
  }

  // const [focusedIndex, setFocusedIndex] = React.useState(0);
  const [searchInput, setSearchInput] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [drawerContent, setDrawerContent] = React.useState("");
  // const [focusedState, setFocusedState] = React.useState({ ...init_focused_states, L0: true });
  const [numLabel, setNumLabel] = React.useState({ pos: 0, neg: 0 })


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    console.log(`Close`)
    setOpen(false);
  };

  const SwitchDrawer = () => {
    setOpen(!open)
  }

  const handleKeyEvent = (event, len_elements) => {

    console.log("key pressed")

    if (event.key === "ArrowDown") {
      if (workspace.focusedIndex < len_elements) {

        dispatch(setFocusedState(workspace.focusedIndex + 1))

      }
    } else if (event.key === "ArrowUp") {

      if (workspace.focusedIndex > 0) {

        dispatch(setFocusedState(workspace.focusedIndex - 1))

      }
    }
  }

  const handleNextLabelClick = () => {

    dispatch(nextPrediction())

    const element_id = workspace.elementsToLabel[workspace.indexPrediction]['id']
    const splits = workspace.elementsToLabel[workspace.indexPrediction]['id'].split("-")
    const docid = workspace.elementsToLabel[workspace.indexPrediction]['docid']
    const eid = parseInt(splits[splits.length-1])
    
    if (docid != workspace.curDocId) {
      dispatch(fetchCertainDocument({ docid, eid })).then(() => {

        console.log(`element id: ${element_id}`)

        console.log(workspace.elements)

        document.getElementById('L'+eid).scrollIntoView({
          behavior: "smooth",
          block: "start",
          // inline: "nearest"
        })
      })
    } else {
      dispatch(setFocusedState(eid))
    }

  }

  const handlePrevLabelClick = () => {

    dispatch(prevPrediction())

    const splits = workspace.elementsToLabel[workspace.indexPrediction]['id'].split("-")
    const docid = workspace.elementsToLabel[workspace.indexPrediction]['docid']
    const eid = parseInt(splits[splits.length-1])
    
    if (docid != workspace.curDocId) {
      dispatch(fetchCertainDocument({ docid, eid }))
    } else {
      dispatch(setFocusedState(eid))
    }
  }

  // React.useEffect(() => {
  //   document.addEventListener('keydown', handleKeyEvent)
  // }, []);

  const handleClick = (event, id) => {

    if (event.detail == 1) {

      dispatch(setFocusedState(id))

    }
  }

  const classes = useStyles();
  const workspace = useSelector(state => state.workspace)

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchDocuments()).then(() => dispatch(fetchElements()).then(() => dispatch(fetchCategories())))

    const interval = setInterval(() => {

      console.log(`curCategory value: ${workspace.curCategory}`)
      
      if (workspace.curCategory != null) {
        const old_model_version = workspace.model_version
        dispatch(checkModelUpdate()).then(() => {
          if (old_model_version != workspace.model_version) {
            console.log(`model version changed to: ${workspace.model_version}`)
            dispatch(fetchElements())
          }
        })
      } else {
      }

    }, 5000);
  
    return () => clearInterval(interval);

  }, [workspace.curCategory])


  const handleSearch = () => {

    dispatch(searchKeywords({keyword: searchInput}))

  }

  const [tabValue, setTabValue] = React.useState(0);
  const [modalOpen, setModalOpen] = React.useState(false)

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Box>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          // open={open}
          anchor="left">
          <DrawerHeader>
            <Typography variant="h6" component="div">
              Sleuth
            </Typography>
            <IconButton>
              <LogoutIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />
          <Stack>
            <AccountInfo>
              <Box sx={{ flexDirection: 'column' }}>
                <Typography sx={{ fontSize: 20 }}>
                  Jack
                </Typography>
                <Typography sx={{ fontSize: 15 }}>
                  jack@gmail.com
                </Typography>
              </Box>
            </AccountInfo>
            {/* <WorkspaceSelect>
              <Typography>Workspace:</Typography>
              <WorkspaceSelectFormControl />
            </WorkspaceSelect> */}
            <Divider />
            <StackBarContainer>
              {/* <PieChart
              data={[
                { title: 'Postitive', value: 50, color: '#90e0ef' },
                { title: 'Negative', value: 20, color: '#ff758f' },
                { title: 'Unlabeled', value: 20, color: '#f9f7f3' },
              ]}
              label={({ dataEntry }) => `${Math.round(dataEntry.percentage)} %`}
              labelStyle={{ fontSize: 9 }}
              animate={true}
            /> */}
              <HSBar
                // showTextIn
                data={[
                  { value: 100 * (numLabel['pos'] / (1.0 * 131)), color: "#99d98c" },
                  { value: 100 * (numLabel['neg'] / (1.0 * 131)), color: "#ff758f" },
                  { value: 10, color: "#f9f7f3" }]} />
            </StackBarContainer>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Workspace" {...a11yProps(0)}/>
                  <Tab label="This file" {...a11yProps(1)}/>
                </Tabs>
              </Box>
              <TabPanel value={tabValue} index={0}>
                <Stack spacing={0} sx={{ marginBottom: 2 }}>
                  <ClassContainer>
                    <Typography><strong>Positive</strong></Typography>
                    <Typography><strong>{numLabel['pos']}</strong></Typography>
                  </ClassContainer>
                  <ClassContainer>
                    <Typography><strong>Negative</strong></Typography>
                    <Typography><strong>{numLabel['neg']}</strong></Typography>
                  </ClassContainer>
                  <ClassContainer>
                    <Typography><strong>Total</strong></Typography>
                    <Typography><strong>{workspace.elements.length}</strong></Typography>
                  </ClassContainer>
                </Stack>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Stack spacing={0} sx={{ marginBottom: 2 }}>
                    <ClassContainer>
                      <Typography><strong>Positive</strong></Typography>
                      <Typography><strong>{numLabel['pos']}</strong></Typography>
                    </ClassContainer>
                    <ClassContainer>
                      <Typography><strong>Negative</strong></Typography>
                      <Typography><strong>{numLabel['neg']}</strong></Typography>
                    </ClassContainer>
                    <ClassContainer>
                      <Typography><strong>Document</strong></Typography>
                      <Typography><strong>{workspace.elements.length}</strong></Typography>
                    </ClassContainer>
                  </Stack>
              </TabPanel>
            </Box>

            <Divider />
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
              <Typography><strong>Model information</strong></Typography>
            </Box>
            <ModelName>
              <Typography>Current classifier:</Typography>
              <Typography>v.{workspace.model_version} model</Typography>
            </ModelName>
            <LinearWithValueLabel />
            {/* <Box>
              <Accordion sx={{ backgroundColor: "grey" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>History</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Card>
                    <CardContent>
                      <Typography sx={{ whiteSpace: "normal" }} paragraph>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua.
                      </Typography>
                    </CardContent>
                  </Card>
                </AccordionDetails>
              </Accordion>
            </Box> */}
          </Stack>
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: `calc(100% - ${drawerWidth}px)` }}>
      <ElevationScroll >
          <AppBar open={open}>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', }}>
              <Typography><strong>Category:</strong></Typography>
              <CategoryFormControl />

              <a>
                <Typography sx={{cursor: "pointer"}} onClick={() => setModalOpen(true)} paragraph component="span" color="primary" variant="body1">
                  create new category
                </Typography>
              </a>
            </Box>
            <ToolBar>
              <ButtonGroup variant="contained" aria-label="split button" sx={{ mr: 2 }}>
                <Button onClick={() => {
                  dispatch(nextPrediction())
                  dispatch(setFocusedState(workspace.indexPrediction))

                  document.getElementById('L'+workspace.indexPrediction).scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    // inline: "nearest"
                  })
                }}>
                Next positive prediction
                </Button>
              </ButtonGroup>
              {
                !open &&
                <Box>
                  <IconButton onClick={() => {
                    setDrawerContent("search")
                    handleDrawerOpen() 
                  }}>
                    <SearchIcon />
                  </IconButton>
                  <IconButton onClick={() => {
                    setDrawerContent("rcmd")
                    dispatch(getElementToLabel())
                    handleDrawerOpen() 
                  }}>
                    <FeaturedPlayListIcon />
                  </IconButton>
                </Box>
              }
            </ToolBar>
          </AppBar>
        </ElevationScroll>
        <Main open={open}>
          <TitleBar>
            <IconButton onClick={() => {
              if (workspace.curDocId > 0) {
                dispatch(fetchPrevDocElements())
              }
            }}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography sx={{ fontSize: 20 }}>
              <strong>
                {workspace.curDocName}
              </strong>
            </Typography>
            <IconButton onClick={() => {
              if (workspace.curDocId < workspace.documents.length - 1) {
                console.log(`click next`)
                dispatch(fetchNextDocElements())
              }
            }}>
              <ChevronRightIcon />
            </IconButton>
          </TitleBar>
          <Box>
            {
                workspace['elements'].length > 0 && workspace['elements'].map((element, index) => {
                const len_elements = workspace['elements'].length
                return (<Element id={'L'+index} keyEventHandler={(e) => handleKeyEvent(e, len_elements)} focusedState={workspace.focusedState} index={index} numLabel={numLabel} numLabelHandler={setNumLabel} clickEventHandler={handleClick} element_id={element['id']} prediction={workspace.predictionForDocCat} text={element['text']} />)
              })
            }
          </Box>
        </Main>

        <Drawer
          sx={{
            width: rightDrawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: rightDrawerWidth,
              boxSizing: 'border-box',
            }
          }}

          PaperProps={{
            sx: {
              backgroundColor: "#f8f9fa",
            }
          }}
          variant="persistent"
          anchor="right"
          open={open}
          // variant="permanent"
          onClose={handleDrawerClose}
        >
          {
            drawerContent == 'search' &&
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItem: 'center', marginTop: 3 }} >
                <IconButton onClick={handleDrawerClose}>
                  <ChevronLeftIcon />
                </IconButton>
                <SearchBar
                  style={{ p: '2px 2px', display: 'flex', alignItems: 'center', width: 300, margin: "0 auto" }}
                  value={searchInput}
                  onRequestSearch={() => handleSearch()}
                  onChange={(newValue) => setSearchInput(newValue)}
                  onCancelSearch={() => setSearchInput("")}
                />
              </Box>
              {
                workspace.searchResult.map((r) => {
                  return (
                    <SearchPanel numLabel={numLabel}  prediction={ r.model_predictions.length > 0 ? r.model_predictions[Object.keys(r.model_predictions)[Object.keys(r.model_predictions).length-1]] : null } element_id={r.id} numLabelHandler={setNumLabel} text={r.text} searchInput={searchInput} docid={r.docid} id={r.id} />
                  )
                })
              }
           </Box>
          }
          {
            drawerContent == 'rcmd' &&
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItem: 'center', marginTop: 3 }} >
                <IconButton onClick={handleDrawerClose}>
                  <ChevronLeftIcon />
                </IconButton>
                <Typography sx={{ textAlign: "center", marginRight: "auto", marginLeft: "auto", marginTop: 2, }}><strong>Recommend to label</strong></Typography>
              </Box>

              <Box>
                {workspace.elementsToLabel.map((r) => {
                  return (
                    <SearchPanel numLabel={numLabel} prediction={r.model_predictions[workspace.curCategory]} element_id={r.id} numLabelHandler={setNumLabel} text={r.text} searchInput={searchInput} docid={r.docid} id={r.id} />
                  )
                })}
              </Box>
           </Box>
          }

        </Drawer>
      </Box>

      <CreateCategoryModal open={modalOpen} setOpen={setModalOpen} />

    </Box>
  );
}

