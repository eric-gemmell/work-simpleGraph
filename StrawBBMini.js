import React from 'react';
import { select, selectAll } from 'd3-selection';
import { axisLeft } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { line, area } from "d3-shape";
import { min, max } from "d3-array";

class StrawBBMini extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			data : props.data || Array.apply(null, Array(50)).map((d,i) => Math.log(i+1) + Math.random()*1 - 3.4),
			height : props.height || 80,
			width : props.width || 80,
			zero: props.zero || 0,
			goodColor: props.goodColor || "green",
			badColor: props.badColor || "red",
			showAxis: props.showAxis || false,
			showLine: props.showLine || false,
			lineColor: props.lineColor || "black",
		};
		console.log(this.state.data);
	}
	render(){
		return (
				<div ref="mainDiv" style={{"width":"100%","height":"100%"}}>
				</div>
		       );
	}
	componentDidMount(){
		let height = this.state.height;
		let width = this.state.width;
		let data = this.state.data;
		let xMargin = width/10;
		let yMargin = height/10;
		let zero = this.state.zero;//this number is draws the line between green and red values, aka good and bad
		console.log(data,height,width);
		let SVG = select(this.refs.mainDiv)
			.append("svg")
			.attr("width",width)
			.attr("height",height);
		let xScale = scaleLinear()
			.domain([0,data.length])
			.range([xMargin,width-xMargin]);
		let yScale = scaleLinear()
			.domain([min(data),max(data)])
			.range([height-yMargin,0+yMargin]);
		//Adding the main Data Line Here
		if(this.state.showLine){
			let drawLine = line()
				.x(function(d,i) { return xScale(i) })
				.y(function(d) { return yScale(d) });

			SVG.append("path")
				.datum(data)
				.attr("fill", "none")
				.attr("stroke", "steelblue")
				.attr("stroke-width", Math.sqrt(1.5*Math.sqrt(1.5*width*height/1067)))
				.attr("d",drawLine);	
		}
		//Adding Axis here
		if(this.state.showAxis){
			let yAxis = axisLeft(yScale)
				.ticks(2);
			SVG.append("g")
				.attr("transform","translate("+xMargin/1.5+",0)")
				.call(yAxis);
		}
		//Adding Area To Graph here
		let drawGoodArea = area()
			.x(function(d,i) { return xScale(i) })      // Position of both line breaks on the X axis
			.y1(function(d) { return Math.min(yScale(zero),yScale(d)) })     // Y position of top line breaks
			.y0(yScale(zero));
		SVG.append("path")
			.datum(data)
			.attr("stroke","none")
			.attr("fill",this.state.goodColor)
			.attr("d",drawGoodArea);

		let drawBadArea = area()
			.x(function(d,i) { return xScale(i) })      // Position of both line breaks on the X axis
			.y1(function(d) { return Math.max(yScale(zero),yScale(d)) })     // Y position of top line breaks
			.y0(yScale(zero));
		SVG.append("path")
			.datum(data)
			.attr("stroke","none")
			.attr("fill",this.state.badColor)
			.attr("d",drawBadArea);
	}
}

export default StrawBBMini;
