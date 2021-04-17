import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Box, InputBase, MenuItem } from "@material-ui/core";
import Search from "@material-ui/icons/Search";
import { grey } from "@material-ui/core/colors";
import { COLORS } from "../../constants";
import { uiAction } from "../../actions";
import Select from "@material-ui/core/Select";

const styles = {
  container: {
    height: 40,
    borderRadius: 10,
    backgroundColor: grey[200],
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    padding: "0px 16px",
    margin: "0px 16px",
    border: `3px solid transparent`,
    focused: {
      border: `3px solid ${COLORS.primary}`,
    },
  },
  icon: {
    fontSize: 26,
    marginRight: 12,
    color: grey[600],
  },
  input: {
    width: "100%",
  },
};

/**
 * @augments {Component<{  style:object>}
 */
class HeaderSearch extends Component {
  state = {
    focused: false,
  };

  render() {
    const { focused } = this.state;
    return (
      <div style={this.props.style}>
        <Box
          style={
            focused
              ? { ...styles.container, ...styles.container.focused }
              : styles.container
          }
        >
          <Search style={styles.icon} />
          <InputBase
            style={styles.input}
            placeholder="Search"
            onFocus={this.focus.bind(this)}
            onBlur={this.unfocus.bind(this)}
            onChange={this.props.searchHandler}
          />
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            // value={age}
            onChange={this.props.filterHandler}
            label="No. of votes"
            placeholder="No. of votes"
            on
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={1}>9 below</MenuItem>
            <MenuItem value={10}>10 - 99</MenuItem>
            <MenuItem value={100}>100 -999</MenuItem>
            <MenuItem value={1000}>1000 above</MenuItem>
          </Select>
        </Box>
      </div>
    );
  }

  focus() {
    this.setState({ focused: true });
    this.props.focus();
  }

  unfocus() {
    this.setState({ focused: false });
    this.props.blur();
  }
}

const mapStateToProps = (state) => {
  return {
    focused: state.ui.search.focus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    focus() {
      dispatch(uiAction.searchFocus());
    },
    blur() {
      dispatch(uiAction.searchBlur());
    },
  };
};

HeaderSearch.propTypes = {
  style: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderSearch);
