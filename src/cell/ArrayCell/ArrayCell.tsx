import * as React from 'react'

const ArrayCell: React.FunctionComponent<{ value?: string[] }> = ({
  value = [],
}) => <React.Fragment>{value?.join(', ')} </React.Fragment>

export default ArrayCell
