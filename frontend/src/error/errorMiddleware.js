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

import { isRejected } from '@reduxjs/toolkit'
import { getErrorMessage } from './errorHandler'
import { setError } from './errorSlice'

/**
 * Middleware that updates the error state anytime an 
 * action thunk resolves into a rejected action.
 * @param {*} param0 
 * @returns 
 */
export const errorMiddleware = ({ dispatch }) => (next) => (action) => {
  if (isRejected(action)) {
    dispatch(setError(getErrorMessage(action.error)))
  }
  return next(action)
}