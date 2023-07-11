import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet
} from "@react-pdf/renderer";


const BORDER_COLOR = '#bfbfbf'
const BORDER_STYLE = 'solid'
const COL1_WIDTH = 40
const COLN_WIDTH = (100 - COL1_WIDTH) / 3
const styles = StyleSheet.create({
  body: {
    padding: 10
  },
  table: { 
    display: "table", 
    width: "auto", 
    borderStyle: BORDER_STYLE, 
    borderColor: BORDER_COLOR,
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0 
  }, 
  tableRow: { 
    margin: "auto", 
    flexDirection: "row" 
  }, 
  tableCol1Header: { 
    width: COL1_WIDTH + '%', 
    borderStyle: BORDER_STYLE, 
    borderColor: BORDER_COLOR,
    borderBottomColor: '#000',
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0,
    backgroundColor:'black',
    color: 'white'
  },     
  tableColHeader: { 
    width: COLN_WIDTH + "%", 
    borderStyle: BORDER_STYLE, 
    borderColor: BORDER_COLOR,
    borderBottomColor: '#000',
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0,
    backgroundColor:'black',
    color: 'white'
  },   
  tableCol1: { 
    width: COL1_WIDTH + '%', 
    borderStyle: BORDER_STYLE, 
    borderColor: BORDER_COLOR,
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  },   
  tableCol: { 
    width: COLN_WIDTH + "%", 
    borderStyle: BORDER_STYLE, 
    borderColor: BORDER_COLOR,
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  }, 
  tableCellHeader: {
    margin: 5, 
    fontSize: 12,
    fontWeight: 500
  },  
  tableCell: { 
    margin: 5, 
    fontSize: 10 
  }
});

export function PdfDocument(props) {    

    /*
        {customerTable: "2", list: Array(4)}
        customerTable: "2"
        list: Array(4)
        0: {menuId: 1, productName: "Fried Chicken", qty: "2", customerTable: "2", productPrice: "10000"}
        1: {menuId: 6, productName: "MenuSet C", qty: "2", customerTable: "2", productPrice: "21000"}
        2: {menuId: 4, productName: "MenuSet A", qty: "2", customerTable: "2", productPrice: "15000"}
        3: {menuId: 8, productName: "Iced sweet tea", qty: "3", customerTable: "2", productPrice: "5000"}
    */

    let renderItem = (data) => {
        return data.map(val => {
            return(
                <View style={styles.tableRow}> 
                    <View style={styles.tableCol1}> 
                        <Text style={styles.tableCell}>{val.menu.name}</Text> 
                    </View> 
                    <View style={styles.tableCol}> 
                        <Text style={styles.tableCell}>{val.quantity} pcs</Text> 
                    </View> 
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Rp {val.menu.price}</Text> 
                    </View>
                    <View style={styles.tableCol}> 
                        <Text style={styles.tableCell}>Rp {parseInt(val.menu.price) * parseInt(val.quantity)}</Text> 
                    </View> 
                </View> 
            )
        })
    }

    let totalSum = (data) => {
        let sum = 0
        data.forEach(item => {
            sum += parseInt(item.menu.price) * parseInt(item.quantity)
        })
        return parseInt(sum)
    }
    // var today = new Date();
    // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // var dateTime = date+' '+time;

    let ppn = parseInt(totalSum(props.data.list) * 0.1)

    return (
        <Document>
            <Page style={styles.body}>
              <View>
                <Text>Checkout time :</Text>
                <Text>{props.dateTime}</Text>
                <Text>Cashier :</Text>
                <Text>{props.cashier}</Text>
                <Text>Customer Table :</Text>
                <Text>{props.customer}</Text>

              </View>

            <View style={styles.table}> 
                <View style={styles.tableRow}> 
                <View style={styles.tableCol1Header}> 
                    <Text style={styles.tableCellHeader}>Product Name</Text> 
                </View> 
                <View style={styles.tableColHeader}> 
                    <Text style={styles.tableCellHeader}>Qty</Text> 
                </View> 
                <View style={styles.tableColHeader}> 
                    <Text style={styles.tableCellHeader}>Product Price</Text> 
                </View> 
                <View style={styles.tableColHeader}> 
                    <Text style={styles.tableCellHeader}>Total</Text> 
                </View> 
                </View>
                {renderItem(props.data.list)}        
            </View>
            <View>
              <Text>Subtotal :</Text>
              <Text>Rp {totalSum(props.data.list)}</Text>
              <Text>PPN 10% :</Text>
              <Text>Rp {ppn}</Text>
              <Text>Grand total :</Text>
              <Text>Rp {totalSum(props.data.list) + ppn}</Text>
              <Text>Cash :</Text>
              <Text>Rp {props.cash}</Text>
              <Text>Change :</Text>
              <Text>Rp {props.change}</Text>


            </View>

            </Page>
        </Document>
    );
}