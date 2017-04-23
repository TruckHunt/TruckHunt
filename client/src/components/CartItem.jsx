import React from 'react';
import { Button, Label, Message, Grid, Header } from 'semantic-ui-react';

const CartItem = ({ name, price, quantity, onRemoveClicked }) => {
  const priceAsString = price.toString();
  const priceWithDecimals = `${priceAsString.slice(0, priceAsString.length - 2)}.${priceAsString.slice(priceAsString.length - 2)}`;

  return (
    <Message size="small">
      <Grid>
        <Grid.Row>
          <Grid.Column width={3} textAlign="center">
            <Label circular basic size="large" color="orange">{quantity}</Label>
          </Grid.Column>
          <Grid.Column width={10}>
            <Header as="h2">{name}</Header>
            <Label basic color="orange">&#36;{priceWithDecimals}</Label>
          </Grid.Column>
          <Grid.Column width={3} textAlign="center">
            <Button circular color="orange" icon="minus" onClick={onRemoveClicked} size="small" />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Message>
  );
};

export default CartItem;
