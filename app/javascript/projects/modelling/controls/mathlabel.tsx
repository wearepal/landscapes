import * as React from 'react'
import { Control } from 'rete'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

interface LabelFieldProps {
  getValue: () => string;
}

const LabelField = ({ getValue }: LabelFieldProps) => {
    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

    const cleanedExpression = getValue().replace('PI', 'π').replace('AREA_M2', 'area(m^2)').replace('AREA_KM2', 'area(km^2)').replace('LENGTH_KM', 'length(km)').replace('LENGTH_M', 'length(m)');

    return (
        <div className="text-center">
        {/* Display mathematical expression in KaTeX format */}
        <BlockMath math={cleanedExpression} />
        </div>
    );
};

// Similar to LabelControl, however, displays mathematical expressions in KaTeX format. Still WIP
export class MathLabelControl extends Control {
    props: LabelFieldProps;
    component: (props: LabelFieldProps) => JSX.Element;

    constructor(key: string) {
        super(key);

        this.props = {
        getValue: this.getData.bind(this, key),
        };

        this.component = LabelField;
  }
}
