import style from './Message.module.css'

// Message used for the user to know what is happening in the application
type MessageProps = {
  variant: 'info' | 'success' | 'draw' | 'error'
  message: string
}

export default function Message({ variant, message }: MessageProps) {
  return <div className={`${style.message} ${style[variant]}`}>{message}</div>
}
