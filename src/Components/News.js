import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'


export class News extends Component {
    static defaultProps = {
        country: "in",
        pageSize: 5,
        category: 'general',
    }
    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            loading: false,
            page: 1,
            totalResults: 0
        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - News App`
    }

    async updateNews() {
        this.props.setProgress(10)
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`
        this.setState({ loading: true })
        let data = await fetch(url)
        this.props.setProgress(30)
        let parsedData = await data.json();
        this.props.setProgress(70)
        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults,
            loading: false
        })
        this.props.setProgress(100)
    }
    async componentDidMount() {
        this.updateNews();
    }
    // handleNextButton = async () => {
    //     this.setState({ page: ++this.state.page })
    //     this.updateNews();
    // }
    // handlePreviousButton = async () => {
    //     this.setState({ page: --this.state.page })
    //     this.updateNews();
    // }
    fetchData = async () => {
        this.setState({page:this.state.page +1})
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`
        let data = await fetch(url)
        let parsedData = await data.json();
        this.setState({
            articles: this.state.articles.concat(parsedData.articles),
            totalResults: parsedData.totalResults,
        })
    }
    render() {
        return (
            <>
                <div className="conatiner my-3">
                    <h1 className="text-center" style={{ margin: '35px' }}>News App- Top {this.capitalizeFirstLetter(this.props.category)} Headlines </h1>
                    {this.state.loading && <Spinner />}
                    <InfiniteScroll
                        dataLength={this.state.articles.length}
                        next={this.fetchData}
                        hasMore={this.state.articles.length !== this.state.totalResults }
                        loader={<Spinner/>}
                    >
                        <div className="container">
                            <div className="row">
                                {/* {!this.state.loading && this.state.articles.map((element) => {
                            return <div className="col md-3" key={element.url}>
                                <NewsItem title={element.title ? element.title.slice(0, 30) : ""}
                                    description={element.description ? element.description.slice(0, 80) : ""}
                                    imageUrl={element.urlToImage}
                                    url={element.url} author={element.author ? element.author : "Unknown"}
                                    publishedAt={element.publishedAt}
                                    source={element.source.name} /> */}
                                {/* {this.state.articles.map((element,index) => {
                                    return <div className="col md-3" key={element.url}> */}
                                    {this.state.articles.map((element,index) => {
                                    return <div className="col md-3" key={index}>
                                        <NewsItem title={element.title ? element.title.slice(0, 30) : ""}
                                            description={element.description ? element.description.slice(0, 80) : ""}
                                            imageUrl={element.urlToImage}
                                            url={element.url} author={element.author ? element.author : "Unknown"}
                                            publishedAt={element.publishedAt}
                                            source={element.source.name} />
                                    </div>
                                })}
                            </div>
                            </div>
                    </InfiniteScroll>
                    {/* <div className="container d-flex justify-content-between">
                        <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handlePreviousButton}>&larr; Previous</button>
                        <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextButton}>Next &rarr;</button>
                    </div> */}
                </div>
            </>
        )
    }
}

export default News
