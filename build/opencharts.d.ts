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
declare module "abstract/chart" {
    export class Chart {
        protected selector: string;
        protected settings: any;
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
        setSettings(settings: any): void;
        protected createSVG(): any;
        protected getCanvasWidth(): number;
        protected getCanvasHeight(): number;
        protected getColor(index: number): string;
    }
}
declare module "abstract/regularChart" {
    import { Chart } from "abstract/chart";
    export class RegularChart extends Chart {
    }
}
declare module "abstract/roundChart" {
    import { Chart } from "abstract/chart";
    export class RoundChart extends Chart {
        protected height: number;
        protected createSVGLegends(svg: any): any;
        protected getLegendX(calculatedLegends: any, i: any, legendWidth: any, legendHeight: any): number;
        protected getLegendY(calculatedLegends: any, i: any): any;
        protected getLegendShapeSize(): number;
    }
}
declare module "interfaces/IData" {
    export interface IPie {
        label: string;
        value: number;
    }
}
declare module "interfaces/ILabel" {
    export enum IType {
        "number" = 0,
        "time" = 1,
        "string" = 2,
    }
}
declare module "bar" {
    import { RegularChart } from "abstract/regularChart";
    import * as ILegend from "interfaces/ILabel";
    export class Bar extends RegularChart {
        protected svg: any;
        protected bar: any;
        constructor(selector: any);
        create(): void;
        getXAxis(type: ILegend.IType, width: any): any;
    }
}
declare module "pie" {
    import { RoundChart } from "abstract/roundChart";
    import * as d3 from "d3";
    export class Pie extends RoundChart {
        protected arc: d3.Arc<any, d3.DefaultArcObject>;
        protected outArc: d3.Arc<any, d3.DefaultArcObject>;
        protected svg: any;
        protected pie: any;
        create(): void;
        update: () => void;
    }
}
declare module "opencharts" {
    export * from "bar";
    export * from "pie";
}
