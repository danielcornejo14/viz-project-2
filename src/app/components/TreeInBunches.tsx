"use client"
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TreeNode {
    name: string;
    children?: TreeNode[];
}

interface TreeInBunchesInterface {
    width: number;
    height: number;
    data: TreeNode;
}

const TreeInBunches: React.FC<TreeInBunchesInterface> = ({ width, height, data }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        d3.selectAll("svg > *").remove()
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height] as any);

        const treeLayout = d3.tree()
            .size([2 * Math.PI, Math.min(width, height) / 2 - 100])
            .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

        const root = d3.hierarchy(data);
        treeLayout(root);

        const radialPoint = (x: number, y: number) => {
            return [(y) * Math.cos(x - Math.PI / 2), (y) * Math.sin(x - Math.PI / 2)];
        };
        const minAndMaxAngle = (node: d3.HierarchyPointNode<TreeNode>) => {
            const angles = node.children.map(child => child.x);
            return [Math.min(...angles), Math.max(...angles)];
        };


        const oddLeavesGravity = 0.15
        const leavesGravity = -0.02
        const drawLinks = (node: d3.HierarchyPointNode<TreeNode>) => {
            if (!node.children || node.children.length === 0) return;

            const [minAng, maxAng] = minAndMaxAngle(node);
            const radius = node.y+80;
            const start = radialPoint(node.x, node.y);
            const midAngle = (minAng + maxAng)/2;
            const midPoint = radialPoint(midAngle, radius);

            // Draw arc
            const arcPath = d3.arc()
                .innerRadius(radius)
                .outerRadius(radius)
                .startAngle(minAng )
                .endAngle(maxAng);

            svg.append("path")
                .attr("d", arcPath as any)
                .attr("fill", "none")
                .attr("stroke", "#555")

            // Draw line from node to midpoint of arc
            svg.append("line")
                .attr("x1", start[0])
                .attr("y1", start[1])
                .attr("x2", midPoint[0])
                .attr("y2", midPoint[1])
                .attr("stroke", "#555");


                node.children.forEach((child, index) => {
                    const childRadius = radius;
                    
                    if(index%2 !== 0 && !child.children){
                        child.y = child.y - (child.y * oddLeavesGravity)
                    }

                    // Adjust as needed
                    const childPossiton = radialPoint(child.x, child.y);
                    const childPoint = radialPoint(child.x, childRadius);
            
                    // Compute the angles for the arc from midPoint to child
                    const childAngle = (child.x + midAngle) / 2;
                    const childArcRadius = (radius + childRadius) / 2;
                    
                    

                    const childArcPath = d3.arc()
                        .innerRadius(childArcRadius)
                        .outerRadius(childArcRadius)
                        .startAngle(midAngle)
                        .endAngle(child.x);



                    // Draw arc from midpoint of the original arc to each child
                    svg.append("path")
                        .attr("d", childArcPath as any)
                        .attr("fill", "none")
                        .attr("stroke", "#555");
                    svg.append("line")
                        .attr("x1", childPoint[0])
                        .attr("y1", childPoint[1])
                        .attr("x2", childPossiton[0])
                        .attr("y2", childPossiton[1])
                        .attr("stroke", "#555");
                    

            
                    // Recursively draw links for each child
                    drawLinks(child, svg);
                });
        };
        drawLinks(root);


        svg.selectAll('circle')
            .data(root.descendants())
            .join('circle')
            .attr('transform', (d, index) => {

                return `translate(${radialPoint(d.x, d.y)})`
            }
            )
            .attr('r', 5)
            .attr('fill', '#999');

    }, [data, width, height]);

    return <svg ref={svgRef}></svg>;
};

export default TreeInBunches;
