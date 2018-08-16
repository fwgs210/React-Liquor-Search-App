import React from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';

export const ItemAccordions = ({producer_name, serving_suggestion, tasting_note}) => (
	<Accordion>
		{
			producer_name ? (<AccordionItem>
				<AccordionItemTitle>
					<h4 className="u-position-relative">Producer
					<div className="accordion__arrow" role="presentation"></div>
					</h4>
				</AccordionItemTitle>
				<AccordionItemBody>
					<p>{producer_name}</p>
				</AccordionItemBody>
			</AccordionItem>) : (<React.Fragment></React.Fragment>)
		}
		{
			serving_suggestion ? (<AccordionItem>
				<AccordionItemTitle>
					<h4 className="u-position-relative">Serving Suggestion
					<div className="accordion__arrow" role="presentation"></div>
					</h4>
				</AccordionItemTitle>
				<AccordionItemBody>
					<p>{serving_suggestion}</p>
				</AccordionItemBody>
			</AccordionItem>) : (<React.Fragment></React.Fragment>)
		}
		{
			tasting_note ? (<AccordionItem>
				<AccordionItemTitle>
					<h4 className="u-position-relative">Tasting Note
					<div className="accordion__arrow" role="presentation"></div>
					</h4>
				</AccordionItemTitle>
				<AccordionItemBody>
					<p>{tasting_note}</p>
				</AccordionItemBody>
			</AccordionItem>) : (<React.Fragment></React.Fragment>)
		}
	</Accordion>
)