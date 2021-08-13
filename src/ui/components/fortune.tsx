import React from 'react';
import './fortune.scss';

interface IFortune {
    fortune?: string;
    loading?: boolean;
    handleClick?: () => void;
    clicked?: number;
}

function Fortune(props: IFortune) {
    const { fortune, loading, clicked } = props;
    const fortuneRef = React.useRef<HTMLDivElement>(null);

    const cardRef = React.useRef<HTMLDivElement>(null);

    const rotate = () => {
        cardRef.current.style.transform = 'rotateY(180deg)';
        props.handleClick();
    };

    React.useEffect(() => {
        if (loading) {
            fortuneRef.current.classList.add('rotating-icon');
        } else {
            fortuneRef.current.classList.remove('rotating-icon');
        }
    }, [loading]);
    return (
        <div className="flip-card" onClick={rotate} ref={fortuneRef}>
            <div className="flip-card-inner" ref={cardRef}>
                <div className="flip-card-front">
                    <img
                        src="https://i.pinimg.com/originals/dc/c8/1a/dcc81ae124a78573b1c8bae1586d4efe.png"
                        alt="Avatar"
                        style={{ width: '300px', height: '300px' }}
                    />
                </div>
                <div className="flip-card-back">
                    <p>
                        {clicked >= 4
                            ? '😢 MAXIMUM FORTUNE IS 3. REFRESH THE PAGE TO RESTART FORTUNE TELLING'
                            : fortune}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Fortune;
