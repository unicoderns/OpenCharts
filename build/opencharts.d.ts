declare module "interfaces/IData" {
    export interface IPie {
        label: string;
        value: number;
    }
}
declare module "utils" {
    export enum Types {
        "pie" = 0,
    }
    export enum VAlign {
        "top" = 0,
        "middle" = 1,
        "bottom" = 2,
    }
    export enum Align {
        "left" = 0,
        "center" = 1,
        "right" = 2,
    }
    export enum Colors {
        "#98abc5" = 0,
        "#8a89a6" = 1,
        "#7b6888" = 2,
        "#6b486b" = 3,
        "#a05d56" = 4,
        "#d0743c" = 5,
        "#ff8c00" = 6,
    }
    export interface Legend {
        position: VAlign;
        align: Align;
        shapeSize: number;
        legends: any;
    }
    export interface Margin {
        top: 20;
        right: 20;
        bottom: 20;
        left: 20;
    }
}
declare module "opencharts" {
    export class Chart {
        protected selector: string;
        protected dataArray: any;
        protected width: number;
        protected height: number;
        protected colors: string[];
        protected margin: {
            top: number;
            right: number;
            bottom: number;
            left: number;
        };
        protected legend: {
            shapeSize: number;
        };
        constructor(selector: any);
        setData(data: any): void;
        protected createSVG(): any;
        protected createSVGLegends(svg: any): any;
        protected getLegendX(calculatedLegends: any, i: any, legendWidth: any, legendHeight: any): number;
        protected getLegendY(calculatedLegends: any, i: any): any;
        protected getCanvasWidth(): number;
        protected getCanvasHeight(): number;
        protected getLegendShapeSize(): number;
        protected getColor(index: number): string;
    }
}
declare module "opencharts.bar" {
    import { Chart } from "opencharts";
    export class Bar extends Chart {
        protected svg: any;
        protected bar: any;
        constructor(selector: any);
        create(): void;
    }
}
declare module "opencharts.pie" {
    import { Chart } from "opencharts";
    import * as d3 from "d3";
    export class Pie extends Chart {
        protected arc: d3.Arc<any, d3.DefaultArcObject>;
        protected outArc: d3.Arc<any, d3.DefaultArcObject>;
        protected svg: any;
        protected pie: any;
        constructor(selector: any);
        create(): void;
        update: () => void;
    }
}
