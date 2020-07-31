import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
	return (
		<div className="ma4 mt0">
			<Tilt
				className="Tilt br2 shadow-2 parallax-effect-glare-scale"
				perspective={500}
				glareEnable={true}
				glareMaxOpacity={0.45}
				scale={1.02}
			>
				<div className="Tilt-inner pa3 inner-element">
					<img alt="logo brain" src={brain}></img>
				</div>
			</Tilt>
		</div>
	);
};

export default Logo;
