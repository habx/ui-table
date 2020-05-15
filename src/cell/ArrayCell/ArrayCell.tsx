import * as React from 'react'

const ArrayCell: React.FunctionComponent<{ value?: string[] }> = ({
  value = [],
}) => <React.Fragment>{value && value.join(', ')} </React.Fragment>

export default ArrayCell
