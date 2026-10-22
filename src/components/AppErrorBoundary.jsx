import { Component } from 'react'
import { PageState } from './PageState.jsx'

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Frizzlife demo render error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-error-page" id="main-content">
          <PageState
            type="error"
            title="ไม่สามารถแสดงหน้านี้ได้"
            description="เกิดข้อผิดพลาดใน Frontend Prototype กรุณาลองโหลดหน้าใหม่ ข้อมูลทั้งหมดเป็นข้อมูลจำลอง"
            action={(
              <button className="primary-button" type="button" onClick={() => window.location.reload()}>
                โหลดหน้าใหม่
              </button>
            )}
          />
        </main>
      )
    }

    return this.props.children
  }
}
