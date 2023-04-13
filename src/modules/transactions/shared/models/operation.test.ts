import {Operation} from "./operation";
import {OperationType} from "../enums/operation-type";
import {OperationDirection} from "../enums/operation-direction";
import {SystemAssetTypes} from "../../../asset-types/shared/enums/system-asset-types";

describe('Operation model', function (){
  let model: Operation;

  beforeEach(()=>{
    model = new Operation();
  })

  it('created', function (){
    expect(model).toBeTruthy();
  });

  it('.asDto (provide default dto value)', function (){
    expect(model.asDto).toEqual({
      type: OperationType.Forward,
      assetType: null,
      name: null,
      direction: OperationDirection.Neutral,
      amount: 0,
    })
  });

  it('.updateFromDto (can be updated from dto)', function (){
    const testDto = {
      type: OperationType.Tax,
      assetType: SystemAssetTypes.CURRENCY,
      name: "USD",
      direction: OperationDirection.Negative,
      amount: 10,
    };

    model.updateFromDto(testDto);
    expect(model.asDto).toEqual(testDto);

    testDto.amount = "100" as unknown as number;
    model.updateFromDto(testDto);
    expect(model.amount).toEqual(100);
  });

  it('.setAssetType (asset type can be changed)', function (){
    model.setAssetType(SystemAssetTypes.CURRENCY);
    expect(model.assetType).toBe(SystemAssetTypes.CURRENCY);
  });

  it('.setName (name can be changed)', function (){
    model.setName('CUSTOM_NAME');
    expect(model.name).toBe('CUSTOM_NAME');
  });

  it('.setDirection (direction can be changed)', function (){
    model.setDirection(OperationDirection.Positive);
    expect(model.direction).toBe(OperationDirection.Positive);
  });

  it('.setAmount (amount can be changed)', function (){
    model.setAmount(100);
    expect(model.amount).toBe(100);
  });

  it('.pipe (amount pipe should work properly)', function (){
    model.setAmount(100);

    model.setDirection(OperationDirection.Neutral);
    expect(model.pipe(100)).toBe(100);

    model.setDirection(OperationDirection.Positive);
    expect(model.pipe(100)).toBe(200);

    model.setDirection(OperationDirection.Negative);
    expect(model.pipe(100)).toBe(0);
  });

})

export {};
