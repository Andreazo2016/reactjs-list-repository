import React, { Component } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Form, SubmitButton, List } from './styles';
import Container from '../../components/Container'


export default class Main extends Component {

  state = {
    newRepo: '',
    repositories: [],
    loading: false,
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value })
  }

  handleSubmit = async e => {
    const { newRepo, repositories } = this.state
    this.setState({ loading: true })
    e.preventDefault()

    const response = await api.get(`/repos/${newRepo}`)

    const data = {
      name: response.data.full_name,
    }

    this.setState({
      repositories: [...repositories, data],
      newRepo: '',
      loading: false
    })
  }

  //carregar os dados do localStorage
  componentDidMount(){
    const repositories = localStorage.getItem('repositories');
    if(repositories){
      this.setState({ repositories: JSON.parse(repositories)})
    }
  }

  //salvar os ddos do localstorage
  componentDidUpdate(_,prevState){
    const { repositories } = this.state

    if( repositories !== prevState.repositories){
      localStorage.setItem('repositories',JSON.stringify(repositories))
    }
  }
  render() {
    const { newRepo, loading, repositories } = this.state
    return (
      <Container  >
        <h1>
          <FaGithubAlt />
          Repositories
          </h1>

        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Adicionar repositorio"
            value={newRepo}
            onChange={this.handleInputChange}
          />
          <SubmitButton loading={loading}>
            {
              loading ? (<FaSpinner color="#fff" size={14} />)
                :
                (<FaPlus color="#fff" size={14} />)

            }

          </SubmitButton>
        </Form>
        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/respository/${encodeURIComponent(repository.name)}`}>Detalhe</Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
