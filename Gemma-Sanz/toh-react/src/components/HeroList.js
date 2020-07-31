import React from 'react';
import heroData from '../heroData';
import { Link } from "react-router-dom";
import '../styles.css';



function HeroList() {
    return (
        <div className="containerComponent">
            {renderedHeroes()}
        </div>
    )
}
const renderedHeroes = () => (
    <div className="mainContainer__list">
        <>
            {heroData.map(hero => (
                < Link key={hero.id} to={`/hero/${hero.id}`}>
                    <div className="button__list" >
                        <span className="element__list__id">{hero.id}</span>
                        <span className="element__list__name">{hero.name}</span>
                    </div>
                </Link>

            ))}
        </>
    </div >
)

export default HeroList;