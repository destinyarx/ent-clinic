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
    })
  }

  const confirm = async (message: string, title = 'Are you sure?') => {
    const result = await Swal.fire({
      title,
      text: message,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    })

    return result.isConfirmed
  }

  return { success, errorNotification, confirm };
}
