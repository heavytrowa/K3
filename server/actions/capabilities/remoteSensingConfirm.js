const { Game, InvItem, Capability, Piece } = require("../../classes");
import { REMOTE_SENSING_SELECTED } from "../../../client/src/redux/actions/actionTypes";
import { SOCKET_SERVER_REDIRECT, SOCKET_SERVER_SENDING_ACTION } from "../../../client/src/constants/otherConstants";
import { GAME_INACTIVE_TAG, GAME_DOES_NOT_EXIST } from "../../pages/errorTypes";
import { REMOTE_SENSING_TYPE_ID, COMBAT_PHASE_ID, SLICE_PLANNING_ID, TYPE_MAIN } from "../../../client/src/constants/gameConstants";
const sendUserFeedback = require("../sendUserFeedback");

const remoteSensingConfirm = async (socket, payload) => {
    const { gameId, gameTeam, gameControllers } = socket.handshake.session.ir3;

    if (payload == null || payload.selectedPositionId == null) {
        sendUserFeedback(socket, "Server Error: Malformed Payload (missing selectedPositionId)");
        return;
    }

    const { selectedPositionId, invItem } = payload;

    const thisGame = await new Game({ gameId }).init();
    if (!thisGame) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_DOES_NOT_EXIST);
        return;
    }

    const { gameActive, gamePhase, gameSlice, game0Points, game1Points } = thisGame;

    if (!gameActive) {
        socket.emit(SOCKET_SERVER_REDIRECT, GAME_INACTIVE_TAG);
        return;
    }

    //gamePhase 2 is only phase for remote sensing
    if (gamePhase != COMBAT_PHASE_ID) {
        sendUserFeedback(socket, "Not the right phase...");
        return;
    }

    //gameSlice 0 is only slice for remote sensing
    if (gameSlice != SLICE_PLANNING_ID) {
        sendUserFeedback(socket, "Not the right slice (must be planning)...");
        return;
    }

    //Only the main controller (0) can use remote sensing
    if (!gameControllers.includes(TYPE_MAIN)) {
        sendUserFeedback(socket, "Not the main controller (0)...");
        return;
    }

    const { invItemId } = invItem;

    //Does the invItem exist for it?
    const thisInvItem = await new InvItem(invItemId).init();
    if (!thisInvItem) {
        sendUserFeedback(socket, "Did not have the invItem to complete this request.");
        return;
    }

    //verify correct type of inv item
    const { invItemTypeId } = thisInvItem;
    if (invItemTypeId != REMOTE_SENSING_TYPE_ID) {
        sendUserFeedback(socket, "Inv Item was not a remote sensing type.");
        return;
    }

    //does the position make sense?
    if (selectedPositionId < 0) {
        sendUserFeedback(socket, "got a negative position for remote sensing.");
        return;
    }

    //insert the 'plan' for remote sensing into the db for later use

    if (!(await Capability.remoteSensingInsert(gameId, gameTeam, selectedPositionId))) {
        sendUserFeedback(socket, "db failed to insert remote sensing, likely already an entry for that position.");
        return;
    }

    await thisInvItem.delete();

    await Piece.updateVisibilities(gameId);
    const gameboardPieces = await Piece.getVisiblePieces(gameId, gameTeam);
    const confirmedRemoteSense = await Capability.getRemoteSensing(gameId, gameTeam);

    // let the client(team) know that this plan was accepted
    const serverAction = {
        type: REMOTE_SENSING_SELECTED,
        payload: {
            invItem: thisInvItem,
            confirmedRemoteSense,
            gameboardPieces
        }
    };
    socket.emit(SOCKET_SERVER_SENDING_ACTION, serverAction);
};

module.exports = remoteSensingConfirm;
