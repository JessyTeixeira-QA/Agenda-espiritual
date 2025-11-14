import { Button } from '@/components/ui/button.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { AlertTriangle, Trash2, CheckCircle, XCircle } from 'lucide-react'

function ModalConfirmacao({ 
  aberto, 
  onFechar, 
  onConfirmar, 
  titulo = "Confirmar Ação", 
  mensagem = "Tem certeza que deseja continuar?", 
  tipo = "warning", // "warning", "danger", "success", "info"
  textoConfirmar = "Confirmar", 
  textoCancelar = "Cancelar" 
}) {
  
  const obterIcone = () => {
    switch (tipo) {
      case 'danger':
        return <Trash2 className="h-6 w-6 text-red-600" />
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case 'info':
        return <XCircle className="h-6 w-6 text-blue-600" />
      case 'warning':
      default:
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />
    }
  }

  const obterCorBotao = () => {
    switch (tipo) {
      case 'danger':
        return 'destructive'
      case 'success':
        return 'default'
      case 'info':
        return 'default'
      case 'warning':
      default:
        return 'default'
    }
  }

  const handleConfirmar = () => {
    onConfirmar()
    onFechar()
  }

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {obterIcone()}
            <DialogTitle>{titulo}</DialogTitle>
          </div>
          <DialogDescription className="mt-2">
            {mensagem}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onFechar}>
            {textoCancelar}
          </Button>
          <Button variant={obterCorBotao()} onClick={handleConfirmar}>
            {textoConfirmar}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModalConfirmacao

