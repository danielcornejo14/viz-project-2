"use client"
import React, { useRef } from 'react'

interface TreeInBunchesInterface  {
    name: string
    height: number
    width:number
    data?: any
}

const TreeInBunches: React.FC<TreeInBunchesInterface> = ({name, height, width, data}) => {
    
    const svgRef = useRef<SVGSVGElement | null>(null);
    
    return(
        <div className="flex">
            <h1>{name}</h1>
            <svg ref={svgRef}/>

        </div>
    )
}

export default TreeInBunches