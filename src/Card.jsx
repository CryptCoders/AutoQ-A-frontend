import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';

export default function Card() {
	return (
		<div className="card-container">
			<div className="element-widget-container">
				<div className="element-icon-box-wrapper">
					<div className="elementor-icon-box">
						<QuizOutlinedIcon
							style={{
								fontSize: 40,
								color: "#fff"
							}}
						/>
						
						<div className="card-header">
							Remember
						</div>
						
						<div className="card-subheader">
							Provide questions and answers on remember level
						</div>
					</div>
				</div>
				
				<div>
				</div>
			</div>
			
			<div className="element-widget-container">
				<div className="element-icon-box-wrapper">
					<div className="elementor-icon-box">
						<span className="elementor-icon">
							<i aria-hidden="true" className="icon icon-medical1"></i>
						</span>
					</div>
				</div>
				
				<div>
				</div>
			</div>
			
			<div className="element-widget-container">
				<div className="element-icon-box-wrapper">
					<div className="elementor-icon-box">
						<span className="elementor-icon">
							<i aria-hidden="true" className="icon icon-medical1"></i>
						</span>
					</div>
				</div>
				
				<div>
				</div>
			</div>
			
		</div>
	)
}
