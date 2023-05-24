import {render} from "../../../../../test-utils";
import FirstStepEn from '../first-steps-content.en';
import enTranslation from '../../../../intl/locale/en.json';
import {act, fireEvent, within} from "@testing-library/react";

describe('FirstStepEn', ()=>{
  let onFinish: jest.Mocked<() => void>;

  beforeEach(()=>{
    onFinish = jest.fn();
  });

  test('initial screen', async ()=>{
    const {getByTestId, queryByTestId} = render(<FirstStepEn onFinish={onFinish}/>);

    let nextButton: HTMLElement;
    const dictStep = getByTestId('dictionaries-step');
    expect(dictStep).toBeInTheDocument();
    expect(queryByTestId('currency-step')).not.toBeInTheDocument();
    expect(queryByTestId('setting-transaction-step')).not.toBeInTheDocument();
    expect(queryByTestId('transaction-step')).not.toBeInTheDocument();


    nextButton = within(dictStep).getByRole('button', {name:enTranslation['app.common.actions.next']});
    await act(async()=>fireEvent.click(nextButton));
    const currStep = getByTestId('currency-step')
    expect(currStep).toBeInTheDocument();

    nextButton = within(currStep).getByRole('button', {name:enTranslation['app.common.actions.next']});
    await act(async()=>fireEvent.click(nextButton));
    const stStep = getByTestId('setting-transaction-step');
    expect(stStep).toBeInTheDocument();
    //
    // await waitFor(()=>within(currStep).getByText(enTranslation['app.common.actions.next']));
    // nextButton = within(currStep).getByRole('button', {name:enTranslation['app.common.actions.next']});
    // await act(async()=>fireEvent.click(nextButton));
    // const tranStep = getByTestId('transaction-step');
    // expect(tranStep).toBeInTheDocument();

  });

});
