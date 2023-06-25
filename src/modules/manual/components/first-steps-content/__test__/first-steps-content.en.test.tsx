import {render} from "../../../../../test-utils";
import FirstStepEn from '../first-steps-content.en';
import enTranslation from '../../../../intl/locale/en.json';
import {act, fireEvent, within} from "@testing-library/react";
import * as fileSaver from "file-saver";

jest.mock("file-saver", ()=>({
  __esModule:true,
  saveAs: jest.fn(),
}))

describe('FirstStepEn', ()=>{
  let onFinish: jest.Mocked<() => void>;

  beforeEach(()=>{
    onFinish = jest.fn();
  });

  test('straightforward way', async ()=>{
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

    nextButton = within(stStep).getByRole('button', {name:enTranslation['app.common.actions.next']});
    await act(async()=>fireEvent.click(nextButton));
    const tranStep = getByTestId('transaction-step');
    expect(tranStep).toBeInTheDocument();

    const finishButton = within(tranStep).getByRole('button', {name:enTranslation['app.common.actions.finish']});
    await act(async()=>fireEvent.click(finishButton));
    expect(onFinish).toHaveBeenCalled();
  });

  test('back way', async ()=>{
    const {getByTestId} = render(<FirstStepEn onFinish={onFinish}/>);

    let dictStep = getByTestId('dictionaries-step');
    const nextButton = within(dictStep).getByRole('button', {name:enTranslation['app.common.actions.next']});
    await act(async()=>fireEvent.click(nextButton));

    const currStep = getByTestId('currency-step');
    expect(currStep).toBeInTheDocument();

    const backButton = within(currStep).getByRole('button', {name:enTranslation['app.common.actions.back']});
    await act(async()=>fireEvent.click(backButton));
    dictStep = getByTestId('dictionaries-step');
    expect(dictStep).toBeInTheDocument();
  });

  test('download transactions', async ()=>{
    const spy = jest.spyOn(fileSaver, "saveAs");
    const {getByTestId, getByRole} = render(<FirstStepEn onFinish={onFinish}/>);

    const next = async ()=> act(async()=>fireEvent.click(getByRole('button', {name:enTranslation['app.common.actions.next']})));

    await next();
    await next();
    const stStep = getByTestId('setting-transaction-step');
    expect(stStep).toBeInTheDocument();
    const downloadButton = within(stStep).getByTestId('FileDownloadIcon');
    expect(downloadButton).toBeInTheDocument();
    await act(async()=>fireEvent.click(downloadButton));
    expect(spy).toHaveBeenCalled();
  });

});
