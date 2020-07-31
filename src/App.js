import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Rank from './components/Rank/Rank';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

// https://docs.clarifai.com/api-guide/api-overview/api-clients
const app = new Clarifai.App({
	apiKey: 'ff2b1f97776341ed8569c85aa7a85889',
});

const particlesOptions = {
	particles: {
		number: {
			value: 50,
			density: {
				enable: true,
				value_area: 400,
			},
		},
	},
};

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			input: 'https://samples.clarifai.com/face-det.jpg',
			imageUrl: 'https://samples.clarifai.com/face-det.jpg',
		};
	}

	onInputChange = event => {
		// console.log(event.target.value);
		this.setState({ input: event.target.value });
	};

	onButtonSubmit = event => {
		this.setState({ imageUrl: this.state.input });

		// https://www.clarifai.com/models/face-detection-image-recognition-model-a403429f2ddf4b49b307e318f00e528b-detection
		app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
			function (response) {
				// do something with response
				console.log(
					response.outputs[0].data.regions[0].region_info.bounding_box
				);
				response.outputs[0].data.regions.forEach(region => {
					console.log(region.region_info.bounding_box);
				});
			},
			function (err) {
				// there was an error
				console.log(err);
			}
		);
	};

	render() {
		return (
			<div className="App">
				<Particles className="particles" params={particlesOptions} />
				<Navigation />
				<Logo />
				<Rank />
				<ImageLinkForm
					onInputChange={this.onInputChange}
					onButtonSubmit={this.onButtonSubmit}
				/>
				<FaceRecognition imageUrl={this.state.imageUrl} />
			</div>
		);
	}
}

export default App;
