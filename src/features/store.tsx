import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import userReducer from './slice/UserSlice';
import CreateInfoReducer from './Info/createInfoSlice';
import estimationReducer from './estimation/estmationSlice';
import estimationFormReducer from './estimation/estimationFormSlice';
import projectReducer from './projectList/projectSlice';
import resourceReducer from './resource/resourcePlanningSlice';
import summaryReducer from "./summary/summarySlice";
import wbsReducer from "./wbs/wbsSlice";
import dealDeskReducer from "./dealDesk/linechartSlice"
import effortDistributionSlice from './dealDesk/effortDistributionSlice';
import dealDeskRoleReducer from "./dealDesk/roleredundancySlice";
import dealDeskFractionalAllocationSlice from "./dealDesk/fractionalAllocationSlice";
import budgetSlice from "./budget/otherCostDiscountSlice"
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// Combine all reducers
const rootReducer = combineReducers({
//   user: userReducer,
  createProject: CreateInfoReducer,
  estimationSummary: estimationReducer,
  estimationForm: estimationFormReducer,
  projects: projectReducer,
  resource: resourceReducer,
  summary: summaryReducer,
  wbs: wbsReducer,
  dealDesk: dealDeskReducer,
  effortDistribution: effortDistributionSlice,
  dealDeskRole: dealDeskRoleReducer,
  dealDeskFractional: dealDeskFractionalAllocationSlice,
  budget: budgetSlice,
});

// Create the store with the rootReducer
// export const store = configureStore({
//   reducer: rootReducer,
// });

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;