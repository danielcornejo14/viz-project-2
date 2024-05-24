"use client";
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface RadialClusterTreeProps {
  data: TreeNode;
  width: number;
  height: number;
}

const RadialClusterTree: React.FC<RadialClusterTreeProps> = ({ data, width, height }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const radius = Math.min(width, height) / 2;

    const tree = d3.tree<TreeNode>()
      .size([2 * Math.PI, radius - 100])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth!);

    const root = d3.hierarchy(data);
    tree(root);

    const nodes = root.descendants();
    const links = root.links();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height] as any)
      .style("font", "10px sans-serif");

    svg.selectAll('*').remove(); // Clear previous renders

    const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(links)
      .enter().append("path")
      .attr("d", d3.linkRadial<any, d3.HierarchyPointNode<TreeNode>>()
        .angle(d => d.x)
        .radius(d => d.y));

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `);

    node.append("circle")
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 3.5)
      .on("click", (event, d) => {
        highlightAndReposition(d);
      });

      const text = node.append("text")
      .attr("display", "none")
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
      .text(d => d.data.name)
      .attr("stroke", "white")

    function highlightAndReposition(d: any) {
      const nodesToHighlight = d.descendants();
      const nonHighlightedNodes = root.descendants().filter((node) => !nodesToHighlight.includes(node));
      const scaleFactor = 1.5; // Factor to adjust the distance of non-highlighted nodes

      // Highlight the selected sub-tree
      node.selectAll("circle")
        .attr("fill", nodeData => nodesToHighlight.includes(nodeData) ? "orange" : (nodeData.children ? "#555" : "#999"));

      link.attr("stroke", linkData => nodesToHighlight.includes(linkData.target as any) ? "orange" : "#555");


      // Reposition nodes
      node.transition()
        .duration(750)
        .attr("transform", nodeData => {
          const angle = nodeData.x * 180 / Math.PI - 90;
          let radius = nodeData.y;
          if (!nodesToHighlight.includes(nodeData)) {
            radius -= 50; // Increase distance for non-highlighted nodes
          }
          return `rotate(${angle}) translate(${radius},0)`;
        });

      // Update links
      link.transition()
        .duration(750)
        .attr("d", d3.linkRadial<any, d3.HierarchyPointNode<TreeNode>>()
          .angle(d => d.x)
          .radius(d => {
            let radius = d.y;
            if (!nodesToHighlight.includes(d)) {
              radius -= 50; // Increase distance for non-highlighted nodes
            }
            return radius;
          }));

      text.attr("display", textData => nodesToHighlight.includes(textData) ? "block" : "none");

    }
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default RadialClusterTree;
