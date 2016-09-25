
function main() {

	var nodes = [0,1,2,3];
	var links = [[0,3],[0,2],[1,0], [2,0],[3,0], [1,2], [2,1], [3,1]]

	//Generate graph objects with nodes and links
	var graphObjs = generateGraphObjects(nodes, links);

	//Apply algorithm
	applyLinksReduction(graphObjs, 0);

	//Set node positions
	adjustNodesPositions(graphObjs.nodes);

	//Plot the graph with its properties
	plotGraph(graphObjs.nodes, graphObjs.links);

}


function applyLinksReduction(graphoObjects, node0Index) {

    //Set node0
    graphoObjects.nodes[node0Index].node0 = true;

    //Iterate thru the links, create and increment nubmer of connections
    for (var i = 0; i < graphoObjects.links.length; i++) {
        var link = graphoObjects.links[i];

        //If the source of this link is a node0, set the link excluded
        if(link.source.node0) {
            link.excluded = true; //Clear
            continue;
        }

        //It the target node inConnections if it has not been initiated yet
        if(link.target.inConnections == undefined)
            link.target.inConnections = 0;

        link.target.inConnections++;    
    }

    console.log(graphoObjects);
}

function adjustNodesPositions(nodes) {

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        node.x = 0;
        node.y = i*100;
    }
}

function generateGraphObjects(nodes, links) {

    //Generate nodeObjects
	var nodeObjs = [];
    for (var i = 0; i < nodes.length; i++)
        nodeObjs.push({ id: nodes[i], x: 0, y: 0 });        

    //Generate linkObjects
    var linkObjs = [];
    for (var i = 0; i < links.length; i++) {
        var link = links[i];

        var sourceNode = nodeObjs[nodes.indexOf(link[0])];
        var targetNode = nodeObjs[nodes.indexOf(link[1])];

        var newLinkObj = {
            source: sourceNode,
            target: targetNode
        }

        //Init input and output arrays one nodes that do not have then yet
        if(sourceNode.outputs == undefined)
            sourceNode.outputs = [];
        if(targetNode.inputs == undefined)
            targetNode.inputs = [];

        //Pass to source and target references of their links
        sourceNode.outputs.push(newLinkObj);
        targetNode.inputs.push(newLinkObj);

        linkObjs.push(newLinkObj);        
    }

    return {
        nodes: nodeObjs,
        links: linkObjs
    }
}


function getLinksArray(blocks) {

	var links = [];

	//First node to generate all the other
	var node0 = blocks[0];

	//Generate main connections
	for (var i = 1; i < blocks.length; i++) {
		var block = blocks[i];

		links.push([block, node0]);	
	}

	//Generate random links on secundary connections
	var numberOfRandomLinks = 2;
	for (var i = 0; i < numberOfRandomLinks; i++) {
		//Get a random index to target, excluding the index number 1
		var fromBlockIndex = getRandomInRange(1,blocks.length-1);
		//Get the "to" index until it is different from "from" index
		do {
			var toBlockIndex = getRandomInRange(1,blocks.length-1);
		} while(toBlockIndex == fromBlockIndex || checkLinkExists(toBlockIndex,fromBlockIndex, links));
		
		var randomLink = [toBlockIndex, fromBlockIndex];
		links.push(randomLink);	
	}

	return links;
}

function checkLinkExists(to, from, links) {
	//Check if it does not exists
	for (var i = 0; i < links.length; i++) {
		var link = links[i];
		//If the links exists, return tru
		if(link[0] == to && link[1] == from)
			return true;		
	}
	return false; //Return false if not
} 

function getRandomInRange(start, end) {
	return Math.round(Math.random()*(end-start) + start);
}


/*		var blocks = [1,2,3,4,5,6,7,8,9,10];
		var links = getLinksArray(blocks);

		var nodeObjs = nodeGenerator(blocks);
		var linkObjs = linkGenerator(links);

	NvgttBlock.prototype.GetColumn = function() {
		var column = 0;

		for(var i = 0; i < this.inputs.length; i++) {
			var inputColumn = this.inputs[i].GetColumn();

			if(column <= inputColumn)
				column = inputColumn + 1;
		}

		return column;
	} 


		var posColumns = [];
		var blocksYGap = 20;
		var xPos = 10;

		blocksSelection.each(function(d) {
			var column = d.GetColumn();

			if(posColumns[column] == undefined)
				posColumns[column] = {
					members: [],
					width: 0,
					height: 0
				}

			posColumns[column].height += d.height + blocksYGap;

			posColumns[column].members.push(d);

			if(d.width > posColumns[column].width)
				posColumns[column].width = d.width; 
		});

		//Get the highest col
		var higherCol = 0;
		for(var i = 0; i < posColumns.length; i++) {
			if(posColumns[i].height > higherCol)
				higherCol = posColumns[i].height;
		}

		for(var i = 0; i < posColumns.length; i++) {

			var yPos = (higherCol - posColumns[i].height) / 2 + 10;

			var column = posColumns[i];

			for(var j = 0; j < column.members.length; j++) {
				var cBlock = column.members[j];

				if(cBlock.x != xPos || cBlock.y != yPos) {

					cBlock.x = xPos;
					cBlock.y = yPos;

					//Update node position
					cBlock.d3Select//.transition().duration(1000)
						.attr("transform", "translate(" + xPos + " " + yPos + ")");	

					eventHandler.fire("move", cBlock);
				}

				yPos += cBlock.height + 20;
			}

			xPos += column.width + 150;
		}*/
