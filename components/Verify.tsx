"use client"

interface VerifyProps {
  data: string | null;
}

const Verify = ({ data }: VerifyProps) => {
  return (
    <div>
        <h1>Verification</h1>
        <p>{data}</p>
    </div>
  )
}

export default Verify