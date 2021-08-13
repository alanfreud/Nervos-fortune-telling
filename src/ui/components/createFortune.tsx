import React from 'react';
import './createfortune.scss';

interface ICreateFortune {
    onFortuneChange?: (e: any) => void;
    createNewFortune?: () => void;
}
function CreateFortune(props: ICreateFortune) {
    return (
        <div className="create-fortune">
            <h3>Write your fortune 🥠</h3>
            <textarea rows={3} onChange={props.onFortuneChange} />
            <button onClick={props.createNewFortune}>Create Fortune 🍪</button>
        </div>
    );
}

export default CreateFortune;
