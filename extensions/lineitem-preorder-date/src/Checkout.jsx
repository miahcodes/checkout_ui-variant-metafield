import React, {useEffect, useState} from 'react';
import {
  Banner,
  useApi,
  reactExtension,
  Text,
  BlockStack,
  useTarget,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.cart-line-item.render-after',
  () => <Extension />,
);

function Extension() {
  const {
    merchandise
  } = useTarget();
  const { lines } = useApi();
  const [data, setData] = useState();
  const {query} = useApi();

  useEffect(() => {
    query(
      `query ($id: ID!, $selectedOptions: [SelectedOptionInput!]!) {
        product(id: $id) {
          variantBySelectedOptions (selectedOptions: $selectedOptions) {
            preorder_date: metafield(namespace: "custom", key: "preorderdate") {
              value
            }
          }
        }
      }`,
      {
        variables: {
          id: merchandise.product.id,
          selectedOptions: merchandise.selectedOptions,
        },
      },
    )
      .then(({data, errors}) => {
        setData(data);
      })
      .catch(console.error);
  }, [query]);


  // console.log(data);

  return (
    <>
      {data && data.product.variantBySelectedOptions.preorder_date && (
        <BlockStack padding={["small100","none","base","none"]}>
          <Text size="small">Pre-order date: {data.product.variantBySelectedOptions.preorder_date.value}</Text>
        </BlockStack>
      )}
    </>
  );
}
