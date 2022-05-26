import { Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from "react-apexcharts";
import './App.css';




function App() {


  const [dataobj, setDataobj] = useState([]);
  const [asset, setAsset] = useState('eth');
  const [interval1, setInterval1] = useState('15m');


  const [series1, setSeries1] = useState([{
    data: []
  }]);

  const names = {
    'eth': 'Ethereum',
    'btc': 'Bitcoin',
    'sol': 'Solana',
    'dot': 'Polkadot',
    'bnb': 'Binance',
    'ada': 'Cardano',

  }


  useEffect(() => {


    const conn = new WebSocket(`wss://stream.binance.com:9443/ws/${asset}eur@kline_${interval1}`);



    conn.onmessage = function (event) {
      const json = JSON.parse(event.data);
      try {
        if ((json.event = 'data')) {

          let obj = {
            x: json.E,
            y: [json.k.o, json.k.h, json.k.l, json.k.c]
          }
        

          dataobj.push(obj)


          series1[0].data = dataobj;
          setSeries1(series1);
          console.log(json);
          console.log(series1);

        }
      } catch (err) {
        console.log(err);
      }
    };

    return () => conn.close();
  }, [asset, interval1, series1,dataobj]);






  const options = {
    chart: {
      type: 'candlestick',
      height: 350
    },
    title: {
      text: 'CandleStick Chart',
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  }


  return (
    <>


      <div className='div1' style={{margin: '1rem' }}>
        <div className="mx-2">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Choose Asset
            </Dropdown.Toggle>

            <Dropdown.Menu className='dropdown'>
              {
                ['eth', 'btc', 'sol', 'dot', 'bnb', 'ada'].map(asset => {
                  return <Dropdown.Item onClick={() => {setAsset(asset);setDataobj([])}}>{names[asset]}</Dropdown.Item>
                }
                )

              }


            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div>

          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Choose Interval
            </Dropdown.Toggle>

            <Dropdown.Menu className='dropdown'>
              {
                ['1m', '3m', '5m', '15m'].map(interval => {
                  return <Dropdown.Item onClick={() => {setInterval1(interval);setDataobj([])}}>{interval}</Dropdown.Item>
                }
                )
              }
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="mx-2 py-2">
          <h5>Asset: {names[asset]}</h5>
        </div>
        <div className="mx-2 py-2">
          <h5>Interval: {interval1}</h5>
        </div>
        <div className="mx-2 py-2">
          <h5>Currency: EUR </h5>
        </div>
      </div>
      <div className="container">
        <Chart options={options} series={series1} markers={{ size: 0 }} dataLabels={{ enabled: false }} type="candlestick" height={549} />

      </div>
      {

      }


    </>);
}

export default App;