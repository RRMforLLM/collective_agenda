from tkinter import *
from tkinter import ttk
from tkinter import messagebox as msgbx

class app(Tk):
    def __init__(self):
        super().__init__()
        self.title("Agenda Colectiva")

        self.ecount = 0

        Label(self, text="AGENDA COLECTIVA", font="Arial 20 bold").grid(column=0, row=0, columnspan=2)
        Label(self, text="Todos los elementos son generados por los usuarios", font="Arial 10").grid(column=0, row=1, columnspan=2)
        
        Button(self, text="AGREGAR", font="Arial 15 bold", width=10, command=self.add).grid(column=0, row=100)
        Button(self, text="REMOVER", font="Arial 15 bold", width=10, command=self.remove).grid(column=1, row=100)

        self.element_blocks = []

        self.mainloop()
    
    def add(self):
        v = Toplevel()
        v.title("AGREGAR")

        options = ["Orientación Educativa", "Formación para el Trabajo", "[Humanidades] Ciencias de la Comunicación",
                   "[Ciencias de la Salud] Temas Selectos de Ciencias de la Salud", "[Físico-Matemático] Temas Selectos de Química",
                   "Geografía", "Seminario de Cultura Regional", "Educación Física", "[Humanidades/Ciencias de la Salud/Físico-Matemático] Cálculo",
                   "[Humanidades/Ciencias de la Salud] Temas Selectos de Matemáticas", "Formación en la Fe", "[Avanzados 3 A] Reading & Writing",
                   "[Avanzados 3 A] Listening & Speaking", "[Avanzados 3 B] Reading & Writing", "[Avanzados 3 B] Listening & Speaking",
                   "Estructura Socioeconómica de México", "Social Studies", "Informática", "Educación Artística", "[Humanidades] Sociología",
                   "[Ciencias de la Salud] Temas Selectos de Biología", "[Físico-Matemático] Temas Selectos de Física", "Probabilidad y Estadística",
                   "Robótica"]
        
        inside_value = StringVar(v)
        inside_value.set("Seleccione")
        
        Label(v, text="Ingrese los datos requeridos", font="Arial 15 bold").grid(column=0, row=0, columnspan=2)
        Label(v, text="Materia:", font="Arial 15 bold").grid(column=0, row=1)
        Label(v, text="Detalles:", font="Arial 15 bold").grid(column=0, row=2)
        Label(v, text="Emisión:", font="Arial 15 bold").grid(column=0, row=3)
        Label(v, text="Entrega:", font="Arial 15 bold").grid(column=0, row=4)

        subjects = ttk.Combobox(v, font="Arial 15", width=10); subjects.grid(column=1, row=1)
        subjects['values'] = options
        subjects['state'] = 'readonly'

        details = Text(v, font="Arial 15", width=10, height=3); details.grid(column=1, row=2)
        emission = Entry(v, font="Arial 15", width=10); emission.grid(column=1, row=3)
        deadline = Entry(v, font="Arial 15", width=10); deadline.grid(column=1, row=4)

        def add():
            subject = str(subjects.get())
            detail = str(details.get("1.0", "end-1c"))
            emission_date = str(emission.get())
            delivery_date = str(deadline.get())
            if (subject or detail or emission_date or delivery_date) == "":
                msgbx.showerror("Error", "Los datos ingresados no son válidos.")
            else:
                ed = []
                for i in emission_date:
                    ed.append(i)
                
                dd = []
                for i in delivery_date:
                    dd.append(i)
                
                if ((ed[2] != "/") or (ed[5] != "/")) or (len(ed) != 10) or ((dd[2] != "/") or (dd[5] != "/")) or (len(dd) != 10):
                    msgbx.showerror("Error", "La(s) fecha(s) ingresada(s) no es/son válida(s).")

                elif (''.join(ed).replace('/', '').isnumeric() == False) or (''.join(dd).replace('/', '').isnumeric() == False):
                    msgbx.showerror("Error", "El/Los dígito(s) en la(s) fecha(s) ingresada(s) no es/son válido(s).")

                else:
                    def add_element(a, b, c, d):
                        separator = ttk.Separator(self, orient=HORIZONTAL); separator.grid(row=(2+self.ecount), columnspan=2, sticky="ew")
                        title = Label(self, text=a, font="Arial 18 bold"); title.grid(column=0, row=(3+self.ecount), columnspan=2)
                        text = Label(self, text=b, font="Arial 15"); text.grid(column=0, row=(4+self.ecount), columnspan=2)
                        datee = Label(self, text="Emitida: "+c, font="Arial 15 bold"); datee.grid(column=0, row=(5+self.ecount))
                        dated = Label(self, text="Límite: "+d, font="Arial 15 bold"); dated.grid(column=1, row=(5+self.ecount))
                        
                        self.element_blocks.append((separator, title, text, datee, dated))
                        self.ecount += 4
                        
                        v.destroy()

                    add_element(subject, detail, emission_date, delivery_date)
        
        Button(v, text="AGREGAR", font="Arial 15 bold", width=10, command=add).grid(column=0, row=5, columnspan=2)
    
    def remove(self):
        for i in self.element_blocks:
            for j in self.element_blocks[i]:
                i[j].destroy()

app()