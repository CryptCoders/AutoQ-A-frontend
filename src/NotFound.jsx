import filenotFoundGif from "./assets/filenotfound.gif";

export default function NotFound() {
	return (
		<div className="notfound">
			<img src={filenotFoundGif} width="245px" alt={ "No questions generated!" } />

			<span className="empty-container">
				No questions generated!
			</span>
		</div>
	)
}