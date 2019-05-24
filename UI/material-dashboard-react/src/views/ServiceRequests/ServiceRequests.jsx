import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "@material-ui/core/Table";
import Card from "components/Card/Card.jsx";
import Check from '@material-ui/icons/Check'
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/Button";

import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import axios from 'axios'
import AlertDialog from "../../components/Dialog/AlertDialog";
import Utils from "../../Utils.jsx";
import { Avatar } from "@material-ui/core";
import { Redirect } from "react-router-dom";

const styles = theme => ({
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  }
});

class ServiceRequests extends React.Component {
  state = {
    tableData: [...Utils.serviceTestData],
    openDeleteDialog: false,
    openCheckDialog: false,
    alertIndex: null
  }

  componentWillMount() {
    this.initData()
  }
  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card plain>
            <CardHeader plain color="primary">
              <h4 className={classes.cardTitleWhite}>Danh sách yêu cầu thêm dịch vụ</h4>
              <p className={classes.cardCategoryWhite}>
                Danh sách tất các yêu cầu thêm dịch vụ chưa được xét duyệt trên hệ thống
              </p>
            </CardHeader>
            <CardBody>
              <Table className={classes.table} >
                <TableHead >
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Tên</TableCell>
                    <TableCell>Nhà cung cấp</TableCell>
                    <TableCell>Loại</TableCell>
                    <TableCell>Địa điểm</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.tableData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Avatar alt="Remy Sharp" src={row.avatar} className={classes.bigAvatar} style={{
                          margin: 5,
                          width: 60,
                          height: 60,
                        }} />
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{`${row.provider_id.firstname} ${row.provider_id.lastname}`}</TableCell>
                      <TableCell>{row.category_id.name}</TableCell>
                      <TableCell>{row.info.location_id.name}</TableCell>
                      <TableCell>{row.rating.points / row.rating.total}</TableCell>
                      <TableCell >
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                          <IconButton color='primary' aria-label="Check" onClick={() => {
                            this.setState({
                              ...this.state,
                              openCheckDialog: true,
                              alertIndex: index
                            })
                          }}>
                            <Check />
                          </IconButton>
                          <IconButton color='secondary' aria-label="Delete" onClick={() => {
                            this.setState({
                              ...this.state,
                              openDeleteDialog: true,
                              alertIndex: index
                            })
                          }}>
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </GridItem>
        {this.state.openDeleteDialog ? <AlertDialog
          title={"Xác nhận xoá yêu cầu?"}
          description={"Bạn đang thực hiện xóa yêu cầu thêm dịch vụ được chọn khỏi hệ thống. Thao tác này không thể được hoàn tác, hãy xác nhận rằng bạn chắc chắn muốn thực hiện thay đổi này."}
          handleCancel={() => {
            this.setState({
              ...this.state,
              openDeleteDialog: false
            })
          }} handleConfirm={() => {
            const index = this.state.alertIndex
            let {open, expectedValue, ...updatedRequest} = this.state.tableData.splice(index, 1)[0]
            updatedRequest.status = "inactive"
            this.setState({
              ...this.state,
              openDeleteDialog: false
            })
            this.updateRequest(updatedRequest)
          }} /> : null}

          {this.state.openCheckDialog ? <AlertDialog
          title={"Xác nhận thêm dịch vụ?"}
          description={"Bạn đang thực hiện thêm dịch vụ được chọn vào hệ thống, hãy xác nhận rằng bạn chắc chắn muốn thực hiện thay đổi này."}
          handleCancel={() => {
            this.setState({
              ...this.state,
              openCheckDialog: false
            })
          }} handleConfirm={() => {
            const index = this.state.alertIndex
            let {open, expectedValue, ...updatedRequest} = this.state.tableData.splice(index, 1)[0]
            updatedRequest.status = "active"
            this.setState({
              ...this.state,
              openCheckDialog: false
            })
            this.updateRequest(updatedRequest)
          }} /> : null}
      </GridContainer>
    );
  }

  initData() {
    axios.get(`${Utils.BASE_URL}/services?status=active`
      , {
        headers: {
          Authorization: Utils.state.token
        }
      }
    )
      .then(response => {
        if (response.data.success) {
          const newData = response.data.data.map((item, index) => {
            return {
              ...item,
              open: false,
              expectedValue: null
            }
          })
          this.setState({
            ...this.state,
            tableData: newData
          })
          console.log(newData)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  updateRequest(serviceRequest) {
    console.log(serviceRequest)
    axios({
      method: 'put',
      url: `${Utils.BASE_URL}/services/${serviceRequest._id}`,
      headers: {
        Authorization: Utils.state.token,
      },
      data: serviceRequest
    }).then(function (response) {
        if (response.data.success) {
          console.log('update service successfully !')
        } else {
          console.log(`update service fail with error msg: ${response.data.message}`);
        }
      }).catch(function (error) {
        console.log(error);
      });
  }
}

export default withStyles(styles)(ServiceRequests);