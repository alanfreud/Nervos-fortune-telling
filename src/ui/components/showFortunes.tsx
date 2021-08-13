import React from 'react';
import { IFortune } from '../../types/root.d';
import Fortune from './fortune';

interface IShowFortune {
    fortunes: IFortune[];
    loading?: boolean;
    totalFortune?: number;
}
function ShowFortunes(props: IShowFortune) {
    const [clicked, setClicked] = React.useState<number>(0);
    const [fortunes, setFortunes] = React.useState<IFortune[]>();

    function shuffle(array: IFortune[]) {
        let currentIndex = array.length;
        let randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    React.useEffect(() => {
        if (props.fortunes) {
            setFortunes(shuffle(props.fortunes));
        }
    }, [props.fortunes]);

    const handleClick = () => {
        setClicked(c => c + 1);
    };

    const generateEmptyArrayForLoading = () => {
        return new Array(4).fill(0);
    };
    return (
        <div className="show-fortunes">
            <h2 style={{ color: '#27807c', textAlign: 'center', width: '100%' }}>Fortunes 🍪</h2>
            {!props.fortunes &&
                generateEmptyArrayForLoading().map((k, i) => {
                    console.log('New Array');

                    return <Fortune key={i} fortune={'Loading...'} loading={props.loading} />;
                })}
            {fortunes?.length > 1 &&
                fortunes.map(fortune => {
                    return (
                        <Fortune
                            key={fortune.id}
                            fortune={fortune.text}
                            loading={props.loading}
                            handleClick={handleClick}
                            clicked={clicked}
                        />
                    );
                })}
        </div>
    );
}

export default React.memo(ShowFortunes);
