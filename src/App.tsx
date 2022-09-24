import { useEffect, useState } from 'react'
import lottery_logo from './assets/lottery.png';
import twitch_logo from './assets/twitch_logo.svg';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useLocation } from 'react-router-dom';
import {bitsData, subsData} from './mock/twitch';
import {tiers} from './mock/const';

export default function App() {
  // const mockBits = bitsData
  // const mockSubs = subsData

  const [cookies, setCookie, removeCookie] = useCookies();
  const [bits, setBits] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [users, setUser] = useState<any[]>([]);
  
  const { hash } = useLocation();

  useEffect(() => {
    if (hash.includes('#access_token')) {
      setCookie('access_token', hash.replace('#access_token=', '').replace('&scope=bits%3Aread+channel%3Aread%3Asubscriptions+user%3Aread%3Aemail&token_type=bearer', ''))
      window.location.href = '/'
    }
    if (cookies.access_token) {
      // user info 
      axios.get(`https://api.twitch.tv/helix/users`, {
        headers: {
          'Authorization': `Bearer ${cookies.access_token}`,
          'Client-Id': 'vz1lvlrmn3jw2fpv16cqs60t8pbtda'
        }
      })
        .then((res) => {
          setCookie('user_id', res.data.data[0].id)
        })
      // bits
      axios.get(`https://api.twitch.tv/helix/bits/leaderboard?count=100&period=month&started_at=2022-09-20T00:00:00.263Z`, {
        headers: {
          'Authorization': `Bearer ${cookies.access_token}`,
          'Client-Id': 'vz1lvlrmn3jw2fpv16cqs60t8pbtda'
        }
      })
        .then((res) => {
          console.log(res.data.data)
          setBits(res.data.data)
          // setBits(mockBits)
          addUser(0);
        })
        .catch((error) => {
          console.log(error)
        })
      // subscription
      axios.get(`https://api.twitch.tv/helix/subscriptions?broadcaster_id=${cookies.user_id}`, {
        headers: {
          'Authorization': `Bearer ${cookies.access_token}`,
          'Client-Id': 'vz1lvlrmn3jw2fpv16cqs60t8pbtda'
        }
      })
        .then((res) => {
          console.log(res.data.data)
          setSubs(res.data.data)
          // setSubs(mockSubs);
          addUser(1)
        })
    }
  }, [])

  const addUser = (kind: number) => {
    switch (kind) {
      // ビッツ
      case 0:
        for (const d of bits) {
          let count = 0;
          for (let i = 0; i < users.length; i++) {
            if (users[i].user_id === d.user_id) {
              let dummy = users;
              dummy[i].ticket = Number(users[i].ticket) + Number((d.score / 500).toFixed());
              setUser(dummy);
              count += 1;
            }
          }
          if (count === 0) {
            let dummy = users;
            dummy.push({user_id: d.user_id, ticket: Number((d.score / 500).toFixed())})
            setUser(dummy)
          }
        }
        break
      // サブスク
      case 1:
        for (const d of subs) {
          let count = 0;
          for (let i = 0; i < users.length; i++) {
            if (users[i].user_id === d.user_id) {
              let dummy = users;
              dummy[i].ticket = Number(dummy[i].ticket) + Number(tiers(d.tier))
              count += 1;
            }
          }
          if (count === 0) {
            let dummy = users;
            dummy.push({user_id: d.user_id, ticket: tiers(d.tier)})
          }
        }
        break
    }
  }

  const login = () => {
    if (cookies.access_token) {
      console.log('You are already logged in.')
    } else {
      console.log(`${import.meta.env.VITE_VERCEL_URL}`)
      window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=vz1lvlrmn3jw2fpv16cqs60t8pbtda&redirect_uri=${import.meta.env.VITE_VERCEL_URL}&response_type=token&scope=bits:read channel:read:subscriptions user:read:email`
    }
  }

  const logout = () => {
    removeCookie('access_token')
    console.log('Logout Done');
  }

  return (
    <div>
      {!cookies.access_token ? 
        <>
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
              <a href='#' onClick={login}>Twitch Login🚀</a>
            </div>
            <div>developer: <a href='https://twitter.com/watson_sei'>watson_sei</a></div>
          </div>
        </> : 
        <>
          <div>
            <div style={{"width": "100%", "height": "40px", "display": "flex", "justifyContent": "end"}}>
              <a href='#' onClick={logout} style={{"marginRight": "40px"}}>Logout🚪</a>
            </div>
            <div style={{"display": "flex", "justifyContent": "flex-start"}}>
              {bits ? 
                <>
                  <div>
                    <h2>ビッツスコア</h2>
                    {bits.map((_, index) => {
                      return (
                        <ul key={index}>
                          <li>ID: {bits[index].user_id}</li>
                          <li>名前: {bits[index].user_name}</li>
                          <li>ビッツ数: {bits[index].score} bits</li>
                          <li>抽選券: {(bits[index].score / 500).toFixed(0)}</li>
                        </ul>
                      )
                    })}
                  </div>
                  <div>
                    <h2>サブスクスコア</h2>
                    {subs.map((_, index) => {
                      return (
                        <ul key={index}>
                          <li>ID: {subs[index].user_id}</li>
                          <li>名前: {subs[index].user_name}</li>
                          <li>ティア: {subs[index].tier / 1000}</li>
                        </ul>
                      )
                    })}
                  </div>
                  <div>
                    <h2>総合スコア</h2>
                    {users.map((_, index) => {
                      return (
                        <ul key={index}>
                          <li>名前: {users[index].user_id}</li>
                          <li>抽選券: {users[index].ticket}</li>
                        </ul>
                      )
                    })}
                  </div>
                </>
              : 
                <>
                  <h1>Cloud not get information.</h1>
                </>}
            </div>
          </div>
        </>
        }
    </div>
  )
}
