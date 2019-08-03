import { combineReducers } from "redux";
import userFeedbackReducer from "./userFeedbackReducer";
import gameInfoReducer from "./gameInfoReducer";
import sidebarReducer from "./sidebarReducer";
import shopReducer from "./shopReducer";
import invReducer from "./invReducer";
import gameboardReducer from "./gameboardReducer";
import gameboardMetaReducer from "./gameboardMetaReducer";

const rootReducer = combineReducers({
	userFeedback: userFeedbackReducer,
	gameInfo: gameInfoReducer,
	selectedMenu: sidebarReducer,
	shopItems: shopReducer,
	invItems: invReducer,
	gameboard: gameboardReducer,
	gameboardMeta: gameboardMetaReducer
});

export default rootReducer;
