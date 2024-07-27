import { Box, Button, FormControl, InputLabel, MenuItem,  Select, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import http from "../../../http"
import IRestaurante from "../../../interfaces/IRestaurante"
import ITag from "../../../interfaces/ITag"

const FormularioPrato = () => {

    const [nomePrato, setNomePrato] = useState('');
    const [descricaoPrato, setDescricaoPrato] = useState('');
    const [tagSelecionada, setTagSelecionada] = useState('');
    const [restauranteSelecionado, setRestauranteSelecionado] = useState('');
    const [imagem, setImagem] = useState<File | null>();

    const [tags, setTags] = useState<ITag[]>([])
    const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

    useEffect(() => {
        http.get< {tags: ITag[]} >('tags/')
            .then(resposta => setTags(resposta.data.tags))

        http.get<IRestaurante[]>('restaurantes/')
            .then(resposta => setRestaurantes(resposta.data))
    }, [])

    const selecionarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
        const imagemEnviada = evento.target.files
        if (imagemEnviada?.length) {
            setImagem(imagemEnviada[0])
        } else {
            setImagem(null)
        }
    }

    const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault()

        const formData = new FormData()

        formData.append('nome', nomePrato);
        formData.append('descricao', descricaoPrato);
        formData.append('tag', tagSelecionada);
        formData.append('restaurante', restauranteSelecionado);

        if(imagem){
            formData.append('imagem', imagem)
        }

        http.request({
            url: 'pratos/',
            method: 'POST',
            headers: {
                'Content-type': 'multipart/form-data'
            },
            data: formData
        })
            .then(() => {
                alert('prato Enviado com sucesso')
                setDescricaoPrato('')
                setNomePrato('')
                setImagem(null)
                setTagSelecionada('')
            })
            .catch(erro => console.log(erro))
    }
    return (
        <>
            {/* conteudo */}
            <Box sx={{ display: 'flex', flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
                <Typography component="h1" variant="h6">Formulário de Pratos</Typography>
                {/* Formulário */}
                <Box component="form" sx={{ width: "100%" }} onSubmit={aoSubmeterForm}>

                    <TextField
                        value={nomePrato}
                        onChange={evento => setNomePrato(evento.target.value)}
                        label="Nome do Prato"
                        variant="standard"
                        fullWidth
                        required
                        margin="dense"
                    />

                    <TextField
                        value={descricaoPrato}
                        onChange={evento => setDescricaoPrato(evento.target.value)}
                        label="Nome do Prato"
                        variant="standard"
                        fullWidth
                        required
                        margin="dense"
                    />

                    <FormControl
                        margin="dense"
                        fullWidth
                    >
                        <InputLabel id="select-tag">Tag</InputLabel>
                        <Select labelId="select-tag" value={tagSelecionada} onChange={e => setTagSelecionada(e.target.value)}>
                            {tags.map(tag => <MenuItem key={tag.id} value={tag.value}>
                                {tag.value}
                            </MenuItem>)}
                        </Select>
                    </FormControl>

                    <FormControl
                        margin="dense"
                        fullWidth
                    >
                        <InputLabel id="select-restaurante">Restaurante</InputLabel>
                        <Select labelId="select-restaurante" value={restauranteSelecionado} onChange={evento => setRestauranteSelecionado(evento.target.value)}>
                            {restaurantes.map(restaurante => <MenuItem key={restaurante.id} value={restaurante.id}>
                                {restaurante.nome}
                            </MenuItem>)}
                        </Select>
                    </FormControl>

                    <input type="file" onChange={evento => selecionarArquivo(evento)}/>

                    <Button sx={{ marginTop: 1 }} type="submit" fullWidth variant="outlined">Salvar</Button>
                </Box>
            </Box>


        </>
    )
}

export default FormularioPrato