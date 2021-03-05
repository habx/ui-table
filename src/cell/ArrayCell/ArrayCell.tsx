import * as React from 'react'

export const ArrayCell: React.FunctionComponent<{ value?: string[] }> = ({
  value = [],
}) => <React.Fragment>{value && value.join(', ')} </React.Fragment>
