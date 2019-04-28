import React from 'react'
import CalendarHeatmap from 'reactjs-calendar-heatmap'

let data = [{
  "date": "2016-01-01",
  "total": 17164,
  "details": [{
    "name": "Project 1",
    "date": "2016-01-01 12:30:45",
    "value": 9192
  }, {
    "name": "Project 2",
    "date": "2016-01-01 13:37:00",
    "value": 6753
  },
  {
    "name": "Project N",
    "date": "2016-01-01 17:52:41",
    "value": 1219
  }]
}]

export const HeatMap = (props) => {
  const {data, heatMapClick} = props

  return (
    <div>
      { props.data && 
    <CalendarHeatmap
      data={data}
      color={'red'}
      overview={'month'}
      handler={heatMapClick}>
    </CalendarHeatmap>
     }
    </div>
  )
}