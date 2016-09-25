
//Plot graph
function plotGraph(nodes, links) {

var angleOffset = Math.PI/4; //Portion of angle removed from a 180 degree circle
var startAngle = Math.PI - angleOffset;
var endAngle = angleOffset;

//Create arc generator
var arc = d3.svg.arc()
    .innerRadius(function(d) {
        //Calc radius      
        var deltaX = d.target.x - d.source.x;
        var deltaY = d.target.y - d.source.y;
        var dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        //Due to trigonometry proof, we see that the radius is equal to:
        d.radius = (dist / 2) / Math.cos(angleOffset);

        //Due to trigonometry proof, the distance we need to move the circle center to match the nodes is:
        d.radiusOffset = (dist / 2) * Math.tan(angleOffset);

        //Calc rotation angle
        d.rotationAngle = -Math.atan(deltaX/deltaY) * 180 / Math.PI;

        //The Y factor is the only thing that matters here, check it for rotation correction
        if(d.target.y < d.source.y)
            d.rotationAngle += 180;

        //d.rotationAngle = 0;

        return d.radius;
    })
    .outerRadius(function(d){ return d.radius })
    .startAngle(function(d) {
        d.boundarieAngle = Math.asin(20/d.radius);
        return startAngle - d.boundarieAngle;
    })
    .endAngle(function(d) {
        return endAngle + d.boundarieAngle;
    });



  //var svg = d3.select('svg').append("g").attr("transform", "translate(50 50)");
  var svg = NvgttChart.Container.select().attr("transform", "translate(50 50)");

  // set up initial nodes and links
  //  - nodes are known by 'id', not by index in array.
  //  - reflexive edges are indicated on the node (as a bold black circle).
  //  - links are always source < target; edge directions are set by 'left' and 'right'.

  // handles to link and node element groups

  var circle = svg.append('svg:g').selectAll('g');
  var path = svg.append('svg:g').selectAll('path');

  // path (link) group
  path = path.data(links);

  // add new links
  path.enter().append('svg:path')
    .attr('class', 'link')
    .style('marker-end', function(d) { return 'url(#start-arrow)'; });

  // set the graph in motion
  path.attr('d', function(d) {
    var deltaX = d.target.x - d.source.x,
        deltaY = d.target.y - d.source.y,
        dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
        normX = deltaX / dist,
        normY = deltaY / dist,
        sourcePadding = 20,
        targetPadding = 25,
        sourceX = d.source.x + (sourcePadding * normX),
        sourceY = d.source.y + (sourcePadding * normY),
        targetX = d.target.x - (targetPadding * normX),
        targetY = d.target.y - (targetPadding * normY);
    
    return arc(d);
    //return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
  })
  .attr("transform", function(d) {
      var newX = d.source.x + (d.target.x - d.source.x) / 2;
      var newY = d.source.y + (d.target.y - d.source.y) / 2;

      //Add the factor to right position the circle center
      newY -= d.radiusOffset * Math.sin(d.rotationAngle * Math.PI / 180);
      newX -= d.radiusOffset * Math.cos(d.rotationAngle * Math.PI / 180);

      return "translate(" + newX + " " + newY + ")rotate(" + d.rotationAngle + ")";  
  })
  .attr("stroke", function(d) {
      return d.excluded ? "#55f" : "#000";  
  });


  // remove old links
  path.exit().remove();

  // circle (node) group
  // NB: the function arg is crucial here! nodes are known by id, not by index!
  circle = circle.data(nodes, function(d) { return d.id; });

  // update existing nodes (reflexive & selected visual states)
  circle.selectAll('circle')
    .style('fill', function(d) { return d.color || "#ddd"});

  // add new nodes
  var g = circle.enter().append('svg:g');

  g.append('svg:circle')
    .attr('class', 'node')
    .attr('r', 20)
    .style('fill', function(d) { return "#ddd"})
    .style('stroke', function(d) { return "#333" });

  // show node IDs
  g.append('svg:text')
      .attr('x', 0)
      .attr('y', 5)
      .attr('class', 'id')
      .text(function(d) { return d.id; });

  // remove old nodes
  circle.exit().remove();

  circle.attr('transform', function(d) {
    return 'translate(' + d.x + ',' + d.y + ')';
  });
}