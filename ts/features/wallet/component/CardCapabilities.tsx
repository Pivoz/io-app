import { View } from "native-base";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { H3 } from "../../../components/core/typography/H3";
import { GlobalState } from "../../../store/reducers/types";
import { EnhancedPaymentMethod } from "../../../store/reducers/wallet/wallets";
import { EnableableFunctionsTypeEnum } from "../../../types/pagopa";
import BpdCardCapability from "../../bonus/bpd/components/BpdCardCapability";
import { isBpdEnabled } from "../../bonus/bpd/saga/orchestration/onboarding/startOnboarding";

type OwnProps = { paymentMethod: EnhancedPaymentMethod };

type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps> &
  OwnProps;

const capabilityFactory = (
  paymentMethod: EnhancedPaymentMethod,
  capability: EnableableFunctionsTypeEnum
) => {
  switch (capability) {
    case EnableableFunctionsTypeEnum.FA:
    case EnableableFunctionsTypeEnum.pagoPA:
      return null;
    case EnableableFunctionsTypeEnum.BPD:
      return isBpdEnabled() ? (
        <BpdCardCapability paymentMethod={paymentMethod} />
      ) : null;
  }
};

const generateCapabilityItems = (paymentMethod: EnhancedPaymentMethod) =>
  paymentMethod.enableableFunctions.reduce((acc, val): ReadonlyArray<
    React.ReactNode
  > => {
    const handlerForCapability = capabilityFactory(paymentMethod, val);
    return handlerForCapability === null ? acc : [...acc, handlerForCapability];
  }, [] as ReadonlyArray<React.ReactNode>);

const CardCapabilities: React.FunctionComponent<Props> = props => {
  const capabilityItems = generateCapabilityItems(props.paymentMethod);
  if (capabilityItems.length === 0) {
    return null;
  }

  return (
    <View>
      <H3 color={"bluegrey"}>Funzioni Disponibili</H3>
      {capabilityItems.map(c => c)}
    </View>
  );
};

const mapDispatchToProps = (_: Dispatch) => ({});

const mapStateToProps = (_: GlobalState) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CardCapabilities);