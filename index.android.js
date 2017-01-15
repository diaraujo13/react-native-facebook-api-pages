/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View, Image, TouchableOpacity, ListView, Button
} from 'react-native';
import * as Animatable from 'react-native-animatable';

export default class FacebookPage extends Component {

  constructor(props){
    super(props);

    this.state = {
      token: "",
      photos_list: [],
      dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
              }),
      proxima: '',
      count: 1,
      anterior: ''
    }
  }

  componentWillMount(){

    this.loadAccessToken();

  }


   loadAccessToken(){

    /* Obtém-se o ACCESS TOKEN */
    fetch('https://graph.facebook.com/oauth/access_token?%20client_id=1836860876590560&client_secret=9ac469305ab8229f038b37a229559ee0&grant_type=client_credentials')
    .then((response) => {

        response
        .text()
        .then((data)=>{
          this.setState({
            token: data
          });

          this.loadPhotos('https://graph.facebook.com/v2.8/282044681817801/photos/uploaded?'+this.state.token);


        })


    })
    .done();
  }

  loadPhotos(URL){
    // fetch('https://graph.facebook.com/v2.8/282044681817801/videos?'+this.state.token)
    fetch(URL)
    .then(res => res.json() )
    .then( data => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data.data),
        proxima:  typeof data.paging.next == 'undefined' ? '' : data.paging.next,
        anterior: typeof data.paging.previous == 'undefined' ? '' : data.paging.previous
      });
    })
  }


  render() {
    return (
      <View style={styles.container}>
        <ListView
        style={{flex: 1}}
          dataSource={this.state.dataSource}
          renderRow={ (rr) => this.renderRow(rr)}
        >
        </ListView>


        <View style={{flex: 0, flexDirection:'row', height: 40,
      alignItems:'center', justifyContent:'center'}}>

        <TouchableOpacity
        style={{ borderRightColor:'#000', borderRightWidth:2,flex: 1,
         maxHeight: this.state.anterior == '' ? 0 : 130}}
        onPress={ () => {
            this.loadPhotos(this.state.anterior)
        }}
        >
          <View style={{alignItems:'center', justifyContent:'center'}}>
            <Text>
              Anterior
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
        style={{flex: 1, }}
        onPress={ () => {
            this.loadPhotos(this.state.proxima)
        }}
        >
          <View style={{ maxHeight: this.state.proxima == '' ? 0 : 130, alignItems:'center', justifyContent:'center'}}>
            <Text>
              Próximo
            </Text>
          </View>
        </TouchableOpacity>
        </View>


      </View>
    );
  }

  renderRow(rowData)
  {

    let formatted_data = new Date(rowData.created_time.toString());
    let data_string = `${formatted_data.getDate()}/${formatted_data.getMonth()+1}/${formatted_data.getFullYear()} às ${formatted_data.getHours()}:${formatted_data.getMinutes()}`;
    // console.log(data_string)
    return(
      <Animatable.View
      animation="bounceInDown"
      duration={1500}
      delay={1000}
      style={{
        flex: 1, marginVertical: 10,
         marginHorizontal: 5, backgroundColor: 'white',
         padding: 20, borderWidth: 1, borderColor:'#f5f5f5' }}>
         <Animatable.Image

          source={{uri:`http://graph.facebook.com/${rowData.id}/picture?type=normal` }}
          style={{flex: 1, height: 250}}
         />


         <Text style={{marginVertical: 10}}>{typeof rowData.name == 'undefined'? '' : rowData.name }</Text>
         <Text style={{marginVertical: 3, fontWeight: 'bold', color:'#ccc', fontSize:12}}>PARA COMPRAS (89)78952-5689</Text>
        <Text style={{fontSize: 10, color: '#ccc', borderLeftWidth: 5, borderLeftColor:'lightblue', paddingLeft: 8}}>{data_string}</Text>
      </Animatable.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: 'rgba(0,0,0,.1)',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('InstagramClone', () => FacebookPage);
