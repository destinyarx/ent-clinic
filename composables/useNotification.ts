import Swal from 'sweetalert2'

export const useNotification = () => {
  const success = (message: string, title = 'Success') => {
    Swal.fire({
      icon: 'success',
      title,
      position: 'top-end',
      text: message,
      timer: 2000,
      showConfirmButton: false,
      background: '#2a2e35',      
      color: '#e0e0e0',    
      width: '400px', 
      padding: '1.5rem',
    })
  }

  const errorNotification = (message: string, title = 'Error') => {
    Swal.fire({
      icon: 'error',
      title,
      position: 'top-end',
      text: message,
      timer: 2000,
      showConfirmButton: false,
      background: '#2a2e35',      
      color: '#e0e0e0',    
      width: '400px', 
      padding: '1.5rem',
    })
  }

  const confirmNotification = async (message: string, title = 'Are you sure?') => {
    const result = await Swal.fire({
      title,
      text: message,
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm',
      reverseButtons: true,
      
      // ─── STYLE OPTIONS ──────────────────────────────────────────
      background: '#2a2e35',      // popup background
      color:      '#e0e0e0',      // all text inside the popup
      width:      '480px',        // popup width
      padding:    '1.5rem',       // popup padding
      cancelButtonColor:  '#ef4444', 
      confirmButtonColor: '#4ade80',  

      customClass: {
        container: 'my-swal-container'
      },
    })

    return result.isConfirmed
  }

  return { success, errorNotification, confirmNotification };
}
