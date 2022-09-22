import { useState } from 'react'
import lottery_logo from './assets/lottery.png';
import twitch_logo from './assets/twitch_logo.svg';

function App() {
  return (
    <div style={{"display": "flex", "flexFlow": "wrap", "justifyContent": "center", "width": "100%", "alignItems": "center", "height": "100vh", "alignContent": "center"}}>
      <div style={{"display": "flex", "width": "100%", "justifyContent": "center"}}>
        <img width={270} src={twitch_logo} />
        <div style={{"fontWeight": "bold", "fontSize": "90px", "margin": "30px"}}>✖︎</div>
        <img width={180} src={lottery_logo} />
      </div>
      <div>
        <h1>Twitchアカウントを連携して、抽選機能を利用しよう！</h1>
      </div>
      <div style={{"width": "100%", "textAlign": "center", "fontSize": "25px"}}>
        <a href='javascript:void(0)' tabIndex={-1}>Twitch Login🚀 (comming soon)</a>
      </div>
      <div>developer: <a href='https://twitter.com/watson_sei'>watson_sei</a></div>
    </div>
  )
}

export default App
