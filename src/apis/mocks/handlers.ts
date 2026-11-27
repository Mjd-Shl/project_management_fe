import contract from '../../../openapi.yaml?raw'
import { createHandlers } from './createHandlers'
export { resetMocks } from './createHandlers'
export const handlers = createHandlers(JSON.parse(contract).paths)
