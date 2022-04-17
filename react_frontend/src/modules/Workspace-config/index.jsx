
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { getWorkspaces } from './workspaceConfigSlice'
import classes from "./workspace-config.module.css"
import ExistingWorkspace from "./ExistingWorkspace"
import NewWorkspace from "./NewWorkspace"
import LoadDocument from "./LoadDocument"
import workspaceConfigIcon from "../../assets/workspace-config/existing_workspace.png"
import uploadDocIcon from "../../assets/workspace-config/upload.png"
import ButtonAppBar from "../../components/bars/upperBar/ButtonAppBar"
import new_workspace_icon from "../../assets/workspace-config/create_new_workspace.png"
import { clearState } from '../Login/LoginSlice';

const Workspaces = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getWorkspaces())
  }, [dispatch])

  const logout = (e) => {
    e.preventDefault()
    dispatch(clearState())
    navigate('/login')
  }

  return (
    <>
      <ButtonAppBar logout={logout} />
      <div className={classes.container}>
        <div className={classes.hexagon}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <img alt="existing workspace" src={workspaceConfigIcon} style={{ width: '25%' }} />
          </div>
          <ExistingWorkspace />
        </div>
        <div className={classes.hexagon}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img alt="new workspace" src={new_workspace_icon} style={{ width: '20%' }} />
          </div>
          <NewWorkspace />
        </div>
        <div className={classes.hexagon}>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-50px', marginBottom: '10px' }}>
            <img alt="load document" src={uploadDocIcon} style={{ width: '35%' }} />
          </div>
          <LoadDocument />
        </div>
      </div>
    </>

  )
};

const workspaces = {
  routeProps: {
    path: "/workspaces",
    element: <Workspaces />
  },
  name: 'workspaces'
}
export default workspaces;