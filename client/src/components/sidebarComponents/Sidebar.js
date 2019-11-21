import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ShopMenu from "./ShopMenu";
import InvMenu from "./InvMenu";
import Gameinfo from "./Gameinfo";
import SpaceArea from "./SpaceArea";
import { menuSelect } from "../../redux/actions";

const sidebarStyle = {
	backgroundColor: "Red",
	position: "absolute",
	top: "0%",
	left: "0%",
	height: "40%",
	width: "5%"
};

const buttonStyle = {
	position: "absolute",
	backgroundSize: "100% 100%",
	backgroundRepeat: "no-repeat",
	backgroundColor: "maroon",
	left: "15%",
	width: "70%",
	paddingTop: "70%"
};

const shopButtonStyle = {
	top: "4%"
};

const invButtonStyle = {
	top: "28%"
};

const spaceButtonStyle = {
	top: "52%"
};

const infoButtonStyle = {
	backgroundImage: 'url("./images/graphics/infoIcon.png")',
	top: "76%"
};

const selectedButtonStyle = {
	backgroundColor: "white"
};

class Sidebar extends Component {
	render() {
		const { gameInfo, selectedMenu, menuSelect } = this.props;

		return (
			<div
				style={sidebarStyle}
				onClick={event => {
					event.preventDefault();
					event.stopPropagation();
				}}
			>
				<ShopMenu selected={selectedMenu === 1} />
				<InvMenu selected={selectedMenu === 2} />
				<SpaceArea selected={selectedMenu === 3} />
				<Gameinfo gameInfo={gameInfo} selected={selectedMenu === 4} />
				<div
					onClick={event => {
						event.preventDefault();
						menuSelect(1);
						event.stopPropagation();
					}}
					style={{
						...buttonStyle,
						...shopButtonStyle,
						...(selectedMenu === 1 ? selectedButtonStyle : "")
					}}
				/>
				<div
					onClick={event => {
						event.preventDefault();
						menuSelect(2);
						event.stopPropagation();
					}}
					style={{
						...buttonStyle,
						...invButtonStyle,
						...(selectedMenu === 2 ? selectedButtonStyle : "")
					}}
				/>
				
				<div
					onClick={event => {
						event.preventDefault();
						menuSelect(3);
						event.stopPropagation();
					}}
					style={{
						...buttonStyle,
						...spaceButtonStyle,
						...(selectedMenu === 3 ? selectedButtonStyle : "")
					}}
				/>
				<div
					onClick={event => {
						event.preventDefault();
						menuSelect(4);
						event.stopPropagation();
					}}
					style={{
						...buttonStyle,
						...infoButtonStyle,
						...(selectedMenu === 4 ? selectedButtonStyle : "")
					}}
				/>
			</div>
		);
	}
}

Sidebar.propTypes = {
	gameInfo: PropTypes.object.isRequired,
	selectedMenu: PropTypes.number.isRequired, //from the parent
	menuSelect: PropTypes.func.isRequired
};

const mapStateToProps = ({ gameInfo }) => ({
	gameInfo
});

const mapActionsToProps = {
	menuSelect
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(Sidebar);
